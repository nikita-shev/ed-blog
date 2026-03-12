import { loginOrEmailValidation } from './fields/loginOrEmail.validation';
import { passwordValidation } from './fields/password.validation';

export const authInputDtoValidation = [loginOrEmailValidation, passwordValidation];
