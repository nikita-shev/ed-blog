import { Router } from 'express';
import { createUserHandler } from './handlers/create-user.handler';
import { inputValidationResultMiddleware } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { userInputDtoValidation } from '../middlewares/validation/input-dto-validation';
import { authMiddleware } from '../../../core/middlewares/auth.middleware';
import { idValidation } from '../../../core/validation/id-validation';
import { deleteUserHandler } from './handlers/delete-user.handler';
import { getUsersHandler } from './handlers/get-users.handler';
import { usersQueryValidation } from '../middlewares/validation/query-params-validation';

export const usersRouter = Router();

// TODO: fix "@ts-ignore"
usersRouter
    .get(
        '/',
        // @ts-ignore
        authMiddleware,
        usersQueryValidation,
        inputValidationResultMiddleware,
        getUsersHandler
    )
    .post(
        '/',
        authMiddleware,
        userInputDtoValidation,
        inputValidationResultMiddleware,
        createUserHandler
    )
    .delete(
        '/:id',
        authMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        deleteUserHandler
    );
