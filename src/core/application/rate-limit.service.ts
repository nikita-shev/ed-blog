import { rateLimitCollection } from '../../db/db.config';
import { createResultObject } from '../result-object/utils/createResultObject';
import { WithId } from 'mongodb';
import { ResultObject, ResultStatus } from '../result-object/result-object.types';

export interface RateLimitInputDto {
    url: string;
    ip: string;
    date: string;
}

// for DB, TODO: rename
export interface RateLimitDto {
    url: string;
    requests: RateLimitRequest[];
}
interface RateLimitRequest {
    ip: string;
    date: string;
}

class RateLimitService {
    private repo: RateLimitRepo;

    constructor(repo: RateLimitRepo) {
        this.repo = repo;
    }

    async getData(url: string, ip: string): Promise<ResultObject<boolean>> {
        const result = await this.repo.findRequests(url, ip);

        // TODO: сделать отдельный логер(fn)
        // console.log('start');
        // result.forEach((el) => {
        //     console.log(new Date(el.date).toString());
        // })
        // console.log('end');

        if (!result.length) return createResultObject(true, ResultStatus.NotFound);

        if (result.length >= 5) {
            return createResultObject(false, ResultStatus.TooManyRequests);
        }

        return createResultObject(true, ResultStatus.Success);
    }

    async saveData(data: RateLimitInputDto): Promise<any> {
        const r = await this.repo.addData(data);

        return createResultObject(r);
    }
}

// ===============> REPO TODO: fix all files

class RateLimitRepo {
    async findRequests(url: string, ip: string): Promise<RateLimitRequest[]> {

        // TODO: заглучшка для тестов (проблема выхода за предел 10с, но не везде)
        const t: { [key: string]: number} = {
            login: 10,
            registration: 13,
            'registration-email-resending': 10,
            'registration-confirmation': 10,
        }
        const path = url.split('/').reverse()[0];

        const result = await rateLimitCollection
            .aggregate<RateLimitDto>([
                { $match: { url } },
                {
                    $project: {
                        _id: 0,
                        requests: {
                            $filter: {
                                input: '$requests',
                                as: 'item',
                                cond: {
                                    $and: [
                                        { $eq: ['$$item.ip', ip] },
                                        {
                                            $gt: [
                                                '$$item.date',
                                                new Date(Date.now() - 10 * 1000).toISOString() // t[path] -> 10
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            ])
            .toArray();

        return result.length ? result[0].requests : [];
    }

    async addData(data: RateLimitInputDto) {
        const result = await rateLimitCollection.updateOne(
            { url: data.url },
            { $push: { requests: { ip: data.ip, date: data.date } } },
            { upsert: true }
        );

        return result.matchedCount === 1;
    }
}

// ===============> init TODO: fix all files

const rateLimitRepo = new RateLimitRepo();
export const rateLimitService = new RateLimitService(rateLimitRepo);
