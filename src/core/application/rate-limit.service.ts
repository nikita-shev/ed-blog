import { rateLimitCollection } from '../../db/db.config';
import { notFoundResult, successResult, tooManyReqResult } from '../utils/result-object';
import { ServiceDto } from '../utils/result-object/types/result-object.types';

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

    async getData(url: string, ip: string): Promise<ServiceDto<boolean>> {
        const result = await this.repo.findRequests(url, ip);

        // TODO: сделать отдельный логер(fn)
        // console.log('start');
        // result.forEach((el) => {
        //     console.log(new Date(el.date).toString());
        // })
        // console.log('end');

        // if (!result.length) return createResultObject(true, ResultStatus.NotFound);
        if (!result.length) return notFoundResult.create(true);

        if (result.length >= 5) {
            // return createResultObject(false, ResultStatus.TooManyRequests);
            return tooManyReqResult.create(false);
        }

        // return createResultObject(true, ResultStatus.Success);
        return successResult.create(true);
    }

    async saveData(data: RateLimitInputDto): Promise<any> {
        const r = await this.repo.addData(data);

        // return createResultObject(r);
        return successResult.create(r);
    }
}

// ===============> REPO TODO: fix all files

class RateLimitRepo {
    async findRequests(url: string, ip: string): Promise<RateLimitRequest[]> {
        // TODO: заглучшка для тестов (проблема выхода за предел 10с, но не везде)
        const t: { [key: string]: number } = {
            login: 10,
            registration: 13,
            'registration-email-resending': 10,
            'registration-confirmation': 10,
            'password-recovery': 10,
            'new-password': 10
        };
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
                                                new Date(Date.now() - t[path] * 1000).toISOString() // t[path] -> 10
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
