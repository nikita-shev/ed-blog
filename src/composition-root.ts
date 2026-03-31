import 'reflect-metadata';
import { Container } from 'inversify';
import { UsersRepository } from './routes/users/repositories/users.repository';
import { UsersQueryRepository } from './routes/users/repositories/users.query.repository';
import { UsersService } from './routes/users/application/users.service';
import { UsersController } from './routes/users/controller/users.controller';
import { SecurityDevicesRepository } from './routes/securityDevices/repositories/security-devices.repository';
import { SecurityDevicesService } from './routes/securityDevices/application/security-devices.service';
import { SecurityDevicesController } from './routes/securityDevices/controller/security-devices.controller';
import { PostsRepository } from './routes/posts/repositories/posts.repository';
import { PostsService } from './routes/posts/application/posts.service';
import { PostsController } from './routes/posts/controller/posts.controller';
import { CommentQueryRepository } from './routes/comments/repositories/comment.query.repository';
import { CommentsRepository } from './routes/comments/repositories/comment.repository';
import { CommentsService } from './routes/comments/application/comments.service';
import { CommentsController } from './routes/comments/controller/comments.controller';
import { BlogsRepository } from './routes/blogs/repositories/blogs.repository';
import { BlogsService } from './routes/blogs/application/blogs.service';
import { BlogsController } from './routes/blogs/controller/blogs.controller';
import { AuthRepository } from './routes/auth/repositories/auth.repository';
import { AuthService } from './routes/auth/application/auth.service';
import { AuthController } from './routes/auth/controller/auth.controller';

export const container = new Container();

// users
container.bind(UsersRepository).to(UsersRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);
container.bind(UsersService).to(UsersService);
container.bind(UsersController).to(UsersController);

// devices(securityDevices)
container.bind(SecurityDevicesRepository).to(SecurityDevicesRepository);
container.bind(SecurityDevicesService).to(SecurityDevicesService);
container.bind(SecurityDevicesController).to(SecurityDevicesController);

// posts
container.bind(PostsRepository).to(PostsRepository);
container.bind(PostsService).to(PostsService);
container.bind(PostsController).to(PostsController);

// comments
container.bind(CommentQueryRepository).to(CommentQueryRepository);
container.bind(CommentsRepository).to(CommentsRepository);
container.bind(CommentsService).to(CommentsService);
container.bind(CommentsController).to(CommentsController);

// blogs
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(BlogsService).to(BlogsService);
container.bind(BlogsController).to(BlogsController);

// auth
container.bind(AuthRepository).to(AuthRepository);
container.bind(AuthService).to(AuthService);
container.bind(AuthController).to(AuthController);
