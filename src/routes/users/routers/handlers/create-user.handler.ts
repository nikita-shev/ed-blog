// import { Request, Response } from 'express';
// import { usersService } from '../../application/users.service';
// import { usersQueryRepository } from '../../repositories/users.query.repository';
// import { UserInputDto, UserOutputDto } from '../../dto/users.dto';
// import { HttpStatus } from '../../../../core/constants/http-statuses';
// import { ErrorsMessages } from '../../../../core/types/error.types';
//
// export async function createUserHandler(
//     req: Request<{}, {}, UserInputDto>,
//     res: Response<UserOutputDto | ErrorsMessages>
// ) {
//     const result = await usersService.createUser(req.body);
//
//     if (typeof result === 'object') {
//         return res.status(HttpStatus.BadRequest).send({ errorsMessages: [result] });
//     }
//
//     const user = await usersQueryRepository.getUserById(result);
//
//     if (!user) {
//         return res.sendStatus(HttpStatus.NotFound);
//     }
//
//     res.status(HttpStatus.Created).send(user);
// }
