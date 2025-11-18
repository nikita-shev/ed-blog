import { userCollection } from '../../db/db.config';
import { convertUserData, mapToUserOutput } from '../routers/mappers/mapToUserOutput';
import { ObjectId, Sort } from 'mongodb';
import { UserOutputDto } from '../dto/users.dto';
import { UsersSearchParams } from '../types/transaction.types';
import { SortDirection } from '../../core/types/sorting.types';
import { OutputDto } from '../../core/types/dto.types';

export const usersQueryRepository = {
    async getUserById(id: string): Promise<UserOutputDto | null> {
        const user = await userCollection.findOne({ _id: new ObjectId(id) });

        if (!user) {
            return null;
        }

        return this._convertUserData(user);
    },

    async getUsers(queryParams: UsersSearchParams): Promise<OutputDto<UserOutputDto>> {
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

        const users = await userCollection
            .find(filter)
            .sort(sorting)
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const totalCount = await userCollection.countDocuments(filter);

        return this._mapToUserOutput({ items: users, totalCount }, { pageNumber, pageSize });
    },

    _convertUserData: convertUserData,
    _mapToUserOutput: mapToUserOutput
};
