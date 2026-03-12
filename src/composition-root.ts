import { UsersRepository } from './routes/users/repositories/users.repository';
import { UsersQueryRepository } from './routes/users/repositories/users.query.repository';
import { UsersService } from './routes/users/application/users.service';
import { UsersController } from './routes/users/routers/users.router';
import { SecurityDevicesRepository } from './routes/securityDevices/repositories/security-devices.repository';
import { SecurityDevicesService } from './routes/securityDevices/application/security-devices.service';
import { SecurityDevicesController } from './routes/securityDevices/routers/security-devices.router';
import { PostsRepository } from './routes/posts/repositories/posts.repository';
import { PostsService } from './routes/posts/application/posts.service';
import { PostsController } from './routes/posts/routers/posts.router';
import { CommentQueryRepository } from './routes/comments/repositories/comment.query.repository';
import { CommentRepository } from './routes/comments/repositories/comment.repository';
import { CommentsService } from './routes/comments/application/comments.service';
import { CommentsController } from './routes/comments/routers/comments.router';
import { BlogsRepository } from './routes/blogs/repositories/blogs.repository';
import { BlogsService } from './routes/blogs/application/blogs.service';
import { BlogsController } from './routes/blogs/routers/blogs.router';

// users
export const usersRepository = new UsersRepository(); // delete export
const usersQueryRepository = new UsersQueryRepository();
export const usersService = new UsersService(usersRepository); // delete export
export const usersController = new UsersController(usersService, usersQueryRepository);

// devices(securityDevices)
const securityDevicesRepository = new SecurityDevicesRepository();
const securityDevicesService = new SecurityDevicesService(securityDevicesRepository);
export const securityDevicesController = new SecurityDevicesController(securityDevicesService);

// comments
const commentQueryRepository = new CommentQueryRepository();
const commentRepository = new CommentRepository();
const commentsService = new CommentsService(commentRepository);
export const commentsController = new CommentsController(commentsService);

// posts
const postsRepository = new PostsRepository();
const postsService = new PostsService(postsRepository, commentRepository);
export const postsController = new PostsController(postsService, commentQueryRepository);

// blogs
const blogsRepository = new BlogsRepository();
const blogsService = new BlogsService(blogsRepository, postsService);
export const blogsController = new BlogsController(blogsService);
