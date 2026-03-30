import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { matchedData } from 'express-validator';
import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../repositories/users.query.repository';
import { resultCodeToHttpException } from '../../../core/utils/result-object/utils/resultCodeToHttpException';
import { UserInputDto, UserOutputDto } from '../dto/users.dto';
import { ErrorsMessages } from '../../../core/types/error.types';
import { HttpStatus } from '../../../core/constants/http-statuses';
import { RequestQuery, ResponseBody, UsersSearchParams } from '../types/transaction.types';

@injectable()
export class UsersController {
    constructor(
        @inject(UsersService) private usersService: UsersService,
        @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository
    ) {}

    async createUser(
        req: Request<{}, {}, UserInputDto>,
        res: Response<UserOutputDto | ErrorsMessages>
    ) {
        const userCreationResult = await this.usersService.createUser(req.body);
        const status = resultCodeToHttpException(userCreationResult.status);

        if (!userCreationResult.data) {
            return res.status(status).send({ errorsMessages: userCreationResult.extensions });
        }

        const userSearchResult = await this.usersQueryRepository.getUserById(
            userCreationResult.data
        );

        if (!userSearchResult.data) {
            return res.sendStatus(resultCodeToHttpException(userCreationResult.status));
        }

        res.status(HttpStatus.Created).send(userSearchResult.data);
    }

    async getUsers(req: RequestQuery, res: ResponseBody) {
        const sanitizedQuery = matchedData<UsersSearchParams>(req, {
            locations: ['query'],
            includeOptionals: true
        });
        const userSearchResult = await this.usersQueryRepository.getUsers(sanitizedQuery);
        const status = resultCodeToHttpException(userSearchResult.status);

        res.status(status).send(userSearchResult.data);
    }

    async deleteUser(req: Request<{ id: string }>, res: Response) {
        const result = await this.usersService.deleteUser(req.params.id);
        const status = resultCodeToHttpException(result.status);

        if (!result.data) return res.sendStatus(status);

        res.sendStatus(status);
    }
}
