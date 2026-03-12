import { RequestQuery, ResponseBody, UsersSearchParams } from '../../types/transaction.types';
import { usersQueryRepository } from '../../repositories/users.query.repository';
import { matchedData } from 'express-validator';
import { HttpStatus } from '../../../../core/constants/http-statuses';

export async function getUsersHandler(req: RequestQuery, res: ResponseBody) {
    const sanitizedQuery = matchedData<UsersSearchParams>(req, {
        locations: ['query'],
        includeOptionals: true
    });
    const users = await usersQueryRepository.getUsers(sanitizedQuery);

    res.status(HttpStatus.Success).send(users);
}
