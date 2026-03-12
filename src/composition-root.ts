import { UsersRepository } from './routes/users/repositories/users.repository';
import { UsersQueryRepository } from './routes/users/repositories/users.query.repository';
import { UsersService } from './routes/users/application/users.service';
import { UsersController } from './routes/users/routers/users.router';
import { SecurityDevicesRepository } from './routes/securityDevices/repositories/security-devices.repository';
import { SecurityDevicesService } from './routes/securityDevices/application/security-devices.service';
import { SecurityDevicesController } from './routes/securityDevices/routers/security-devices.router';

// users
export const usersRepository = new UsersRepository(); // delete export
const usersQueryRepository = new UsersQueryRepository();
export const usersService = new UsersService(usersRepository); // delete export
export const usersController = new UsersController(usersService, usersQueryRepository);

// devices(securityDevices)
const securityDevicesRepository = new SecurityDevicesRepository();
const securityDevicesService = new SecurityDevicesService(securityDevicesRepository);
export const securityDevicesController = new SecurityDevicesController(securityDevicesService);
