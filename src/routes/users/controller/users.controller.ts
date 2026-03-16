import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../repositories/users.query.repository';
import { Request, Response } from 'express';
import { UserInputDto, UserOutputDto } from '../dto/users.dto';
import { ErrorsMessages } from '../../../core/types/error.types';
import { HttpStatus } from '../../../core/constants/http-statuses';
import { RequestQuery, ResponseBody, UsersSearchParams } from '../types/transaction.types';
import { matchedData } from 'express-validator';

export class UsersController {
    constructor(
        private usersService: UsersService,
        private usersQueryRepository: UsersQueryRepository
    ) {}

    async createUser(
        req: Request<{}, {}, UserInputDto>,
        res: Response<UserOutputDto | ErrorsMessages>
    ) {
        const result = await this.usersService.createUser(req.body);

        if (typeof result === 'object') {
            return res.status(HttpStatus.BadRequest).send({ errorsMessages: [result] });
        }

        const user = await this.usersQueryRepository.getUserById(result);

        if (!user) {
            return res.sendStatus(HttpStatus.NotFound);
        }

        res.status(HttpStatus.Created).send(user);
    }

    async getUsers(req: RequestQuery, res: ResponseBody) {
        const sanitizedQuery = matchedData<UsersSearchParams>(req, {
            locations: ['query'],
            includeOptionals: true
        });
        const users = await this.usersQueryRepository.getUsers(sanitizedQuery);

        res.status(HttpStatus.Success).send(users);
    }

    async deleteUser(req: Request<{ id: string }>, res: Response) {
        const result = await this.usersService.deleteUser(req.params.id);

        if (!result) {
            return res.sendStatus(HttpStatus.NotFound);
        }

        res.sendStatus(HttpStatus.NoContent);
    }
}
