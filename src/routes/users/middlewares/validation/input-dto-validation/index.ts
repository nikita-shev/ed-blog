import { loginValidation } from './modules/login.validation';
import { passwordValidation } from './modules/password.validation';
import { emailValidation } from './modules/email.validation';

// TODO: fix path "modules" -> "fields"

export const userInputDtoValidation = [loginValidation, passwordValidation, emailValidation];
