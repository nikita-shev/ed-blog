import { Sort } from 'mongodb';
import { injectable } from 'inversify';
import { UserModel } from '../schema/schema';
import { notFoundResult, successResult } from '../../../core/utils/result-object';
import { createPaginationResult } from '../../../core/utils/pagination-result/pagination-result';
import { mapUserDataForDto } from '../routers/mappers/mapUserData';
import { UserOutputDto } from '../dto/users.dto';
import { UsersSearchParams } from '../types/transaction.types';
import { SortDirection } from '../../../core/types/sorting.types';
import { OutputDto } from '../../../core/types/dto.types';
import { ServiceDto } from '../../../core/utils/result-object/types/result-object.types';

@injectable()
export class UsersQueryRepository {
    async getUserById(id: string): Promise<ServiceDto<UserOutputDto | null>> {
        const user = await UserModel.findOne({ _id: id });

        if (!user) {
            return notFoundResult.create(null);
        }

        return successResult.create(mapUserDataForDto(user));
    }

    async getUsers(queryParams: UsersSearchParams): Promise<ServiceDto<OutputDto<UserOutputDto>>> {
        const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm } =
            queryParams;

        // TODO: move
        const mapSearchParams = [
            { field: 'login', search: searchLoginTerm },
            { field: 'email', search: searchEmailTerm }
        ]
            .filter((el) => el.search)
            .map((el) => ({ [el.field]: { $regex: el.search, $options: 'i' } }));
        const filter = mapSearchParams.length ? { $or: mapSearchParams } : {};

        const sorting: Sort = {
            [sortBy]: sortDirection === SortDirection.Asc ? 1 : -1,
            createdAt: sortDirection === SortDirection.Asc ? 1 : -1
        };
        const skip = (pageNumber - 1) * pageSize;

        const users = await UserModel.find(filter).sort(sorting).skip(skip).limit(pageSize).lean();
        const totalCount = await UserModel.countDocuments(filter);

        return successResult.create(
            createPaginationResult(
                { items: users.map(mapUserDataForDto), totalCount },
                { pageNumber, pageSize }
            )
        );
    }
}
