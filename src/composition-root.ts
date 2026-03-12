import { UsersRepository } from './routes/users/repositories/users.repository';
import { UsersQueryRepository } from './routes/users/repositories/users.query.repository';
import { UsersService } from './routes/users/application/users.service';
import { UsersController } from './routes/users/routers/users.router';

// users
export const usersRepository = new UsersRepository(); // delete export
const usersQueryRepository = new UsersQueryRepository();
export const usersService = new UsersService(usersRepository); // delete export
export const usersController = new UsersController(usersService, usersQueryRepository);
