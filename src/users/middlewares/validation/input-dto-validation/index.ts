import { loginValidation } from './modules/login.validation';
import { passwordValidation } from './modules/password.validation';
import { emailValidation } from './modules/email.validation';

export const userInputDtoValidation = [loginValidation, passwordValidation, emailValidation];
