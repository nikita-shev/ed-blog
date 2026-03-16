import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { userInputDtoValidation } from '../middlewares/validation/input-dto-validation';
import { authMiddleware } from '../../../core/middlewares/auth.middleware';
import { idValidation } from '../../../core/validation/id-validation';
import { usersQueryValidation } from '../middlewares/validation/query-params-validation';
import { usersController } from '../../../composition-root';

export const usersRouter = Router();

// TODO: fix "@ts-ignore"
usersRouter
    .get(
        '/',
        // @ts-ignore
        authMiddleware,
        usersQueryValidation,
        inputValidationResultMiddleware,
        usersController.getUsers.bind(usersController)
    )
    .post(
        '/',
        authMiddleware,
        userInputDtoValidation,
        inputValidationResultMiddleware,
        usersController.createUser.bind(usersController)
    )
    .delete(
        '/:id',
        authMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        usersController.deleteUser.bind(usersController)
    );
