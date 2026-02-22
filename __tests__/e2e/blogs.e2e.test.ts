import request from 'supertest';
import { PATHS } from '../../src/core/constants/paths';
import { HttpStatus } from '../../src/core/constants/http-statuses';
import {
    authorizationData,
    dataForUpdatingBlog,
    incorrectBlog,
    incorrectId
} from '../common/constants/mock-data';
import { incorrectField, maxFieldLengthExceeded, requiredField } from '../common/utils/errors';
import { mapData } from '../common/utils/mapData';
import { BlogInputDto, BlogOutputDto } from '../../src/blogs/dto';
import { TestData } from '../common/utils/test-data';
import { initTestApp } from '../common/initTestApp';
import { PostInputWithoutBlogIdDto } from '../../src/posts/dto/post.input-dto';
import { PostOutputDto } from '../../src/posts/dto';

describe('Tests path "/blogs"', () => {
    const { app, runDB, clearDb } = initTestApp();
    const testData = new TestData(app);

    beforeAll(async () => {
        await runDB();
        await clearDb();
    });

    let blogs: BlogOutputDto[] = [];

    describe('POST /blogs', () => {
        it('should return an error because it is not authorized', async () => {
            await request(app).post(`${PATHS.blogs}/`).send({}).expect(HttpStatus.Unauthorized);
        });

        it('should create one blog', async () => {
            const newBlog: BlogInputDto = {
                name: `Blog 1`,
                description: `blog description 1`,
                websiteUrl: `https://www.google.com`
            };

            const response = await request(app)
                .post(`${PATHS.blogs}/`)
                .set('Authorization', authorizationData)
                .send(newBlog);

            expect(response.status).toBe(HttpStatus.Created);
            expect(response.body).toEqual({
                id: expect.any(String),
                name: newBlog.name,
                description: newBlog.description,
                websiteUrl: newBlog.websiteUrl,
                createdAt: expect.any(String),
                isMembership: expect.any(Boolean)
            });
        });

        it('should check for invalid input', async () => {
            const response = await request(app)
                .post(`${PATHS.blogs}/`)
                .set('Authorization', authorizationData)
                .send(incorrectBlog);

            expect(response.status).toBe(HttpStatus.BadRequest);
            expect(response.body).toEqual({
                errorsMessages: [
                    incorrectField('websiteUrl'),
                    maxFieldLengthExceeded('name'),
                    requiredField('description')
                ]
            });
        });
    });

    describe('GET /blogs', () => {
        beforeAll(async () => {
            await clearDb();
            blogs = await testData.createBlogs([1, 2, 3, 4, 5]);
        });

        it('should return multiple records from the database without pagination', async () => {
            const response = await request(app).get(`${PATHS.blogs}`);

            expect(response.status).toBe(HttpStatus.Success);
            expect(response.body).toEqual(mapData([...blogs].reverse()));
        });

        it('should return multiple records from the database with pagination', async () => {
            const query = { pageSize: 3, pageNumber: 2 }; // BlogsSearchParams
            const response = await request(app).get(`${PATHS.blogs}`).query(query);

            expect(response.status).toBe(HttpStatus.Success);
            expect(response.body).toEqual(
                mapData([...blogs].reverse(), query.pageSize, query.pageNumber)
            );
        });
    });

    describe('GET /blogs/:id', () => {
        let blogId: string;

        beforeAll(async () => {
            await clearDb();

            blogs = await testData.createBlogs([1]);
            blogId = blogs[0].id;
        });

        it('should check the blog id', async () => {
            const response = await request(app).get(`${PATHS.blogs}/${incorrectId}`);

            expect(response.status).toBe(HttpStatus.BadRequest);
            expect(response.body).toEqual({
                errorsMessages: [incorrectField('id')]
            });
        });

        it('should get an error because a blog with this ID has not been created', async () => {
            const testId = `1${blogId.slice(1)}`;
            const response = await request(app).get(`${PATHS.blogs}/${testId}`);

            expect(response.status).toBe(HttpStatus.NotFound);
        });

        it('should return the created blog', async () => {
            const response = await request(app).get(`${PATHS.blogs}/${blogId}`);

            expect(response.status).toBe(HttpStatus.Success);
            expect(response.body.name).toBe('Blog 1');
        });
    });

    describe('PUT /blogs/:id', () => {
        let blogId: string;

        beforeAll(async () => {
            await clearDb();

            blogs = await testData.createBlogs([1]);
            blogId = blogs[0].id;
        });

        it('should return an error because it is not authorized', async () => {
            const response = await request(app)
                .put(`${PATHS.blogs}/${blogId}`)
                .send(dataForUpdatingBlog);

            expect(response.status).toBe(HttpStatus.Unauthorized);
        });

        it('should check the blog id', async () => {
            const response = await request(app)
                .put(`${PATHS.blogs}/${incorrectId}`)
                .set('Authorization', authorizationData)
                .send(dataForUpdatingBlog);

            expect(response.status).toBe(HttpStatus.BadRequest);
            expect(response.body).toEqual({
                errorsMessages: [incorrectField('id')]
            });
        });

        it('should return an error because the blog was not found', async () => {
            const testId = `1${blogId.slice(1)}`;
            const response = await request(app)
                .put(`${PATHS.blogs}/${testId}`)
                .set('Authorization', authorizationData)
                .send(dataForUpdatingBlog);

            expect(response.status).toBe(HttpStatus.NotFound);
        });

        it('should process incorrect data', async () => {
            const response = await request(app)
                .put(`${PATHS.blogs}/${blogId}`)
                .set('Authorization', authorizationData)
                .send(incorrectBlog);

            expect(response.status).toBe(HttpStatus.BadRequest);
            expect(response.body).toEqual({
                errorsMessages: [
                    incorrectField('websiteUrl'),
                    maxFieldLengthExceeded('name'),
                    requiredField('description')
                ]
            });
        });

        it('the created blog has been found and updated', async () => {
            const response = await request(app)
                .put(`${PATHS.blogs}/${blogId}`)
                .set('Authorization', authorizationData)
                .send(dataForUpdatingBlog);

            expect(response.status).toBe(HttpStatus.NoContent);
        });
    });

    describe('DELETE /blogs/:id', () => {
        let blogId: string;

        beforeAll(async () => {
            await clearDb();

            blogs = await testData.createBlogs([1]);
            blogId = blogs[0].id;
        });

        it('should return an error because it is not authorized', async () => {
            await request(app).delete(`${PATHS.blogs}/${blogId}`).expect(HttpStatus.Unauthorized);
        });

        it('should check the blog id', async () => {
            const response = await request(app)
                .delete(`${PATHS.blogs}/${incorrectId}`)
                .set('Authorization', authorizationData);

            expect(response.status).toBe(HttpStatus.BadRequest);
            expect(response.body).toEqual({
                errorsMessages: [incorrectField('id')]
            });
        });

        it('should return an error because the blog was not found', async () => {
            const testId = `1${blogId.slice(1)}`;
            await request(app)
                .delete(`${PATHS.blogs}/${testId}`)
                .set('Authorization', authorizationData)
                .expect(HttpStatus.NotFound);
        });

        it('the blog has been successfully deleted', async () => {
            await request(app)
                .delete(`${PATHS.blogs}/${blogId}`)
                .set('Authorization', authorizationData)
                .expect(HttpStatus.NoContent);
        });

        it('searching for a blog by ID in the database after deletion', async () => {
            await request(app).get(`${PATHS.blogs}/${blogId}`).expect(HttpStatus.NotFound);
        });
    });

    describe('POST /blogs/:blogId/posts', () => {
        let blogId: string;

        beforeAll(async () => {
            await clearDb();

            blogs = await testData.createBlogs([1]);
            blogId = blogs[0].id;
        });

        const correctData: PostInputWithoutBlogIdDto = {
            title: 'string',
            shortDescription: 'string',
            content: 'string'
        };
        const incorrectData = {
            title: 'string string string string string string string string',
            // shortDescription: 'string',
            content: 'string'
        };

        it('проверка авторизации', async () => {
            const response = await request(app)
                .post(`${PATHS.blogs}/${blogId}/posts`)
                .send(correctData);
            // .expect(HttpStatus.Unauthorized);

            expect(response.status).toBe(HttpStatus.Unauthorized);
        });

        it('проверка id блога', async () => {
            const response = await request(app)
                .post(`${PATHS.blogs}/${incorrectId}/posts`)
                .set('Authorization', authorizationData)
                .send(correctData);

            expect(response.status).toBe(HttpStatus.BadRequest);
            expect(response.body).toEqual({
                errorsMessages: [incorrectField('blogId')]
            });
        });

        it('неверный ввод данных', async () => {
            const response = await request(app)
                .post(`${PATHS.blogs}/${blogId}/posts`)
                .set('Authorization', authorizationData)
                .send(incorrectData);

            expect(response.status).toBe(HttpStatus.BadRequest);
            expect(response.body).toEqual({
                errorsMessages: [
                    maxFieldLengthExceeded('title', 30),
                    requiredField('shortDescription')
                ]
            });
        });

        it('блог не найден', async () => {
            const testId = `1${blogId.slice(1)}`;
            const response = await request(app)
                .post(`${PATHS.blogs}/${testId}/posts`)
                .set('Authorization', authorizationData)
                .send(correctData);
            // .expect(HttpStatus.NotFound);

            expect(response.status).toBe(HttpStatus.NotFound);
        });

        it('пост для блога создан', async () => {
            const response = await request(app)
                .post(`${PATHS.blogs}/${blogId}/posts`)
                .set('Authorization', authorizationData)
                .send(correctData);

            expect(response.status).toBe(HttpStatus.Created);
            expect(response.body).toEqual({
                id: expect.any(String),
                blogId,
                blogName: expect.any(String),
                title: correctData.title,
                shortDescription: correctData.shortDescription,
                content: correctData.content,
                createdAt: expect.any(String)
            });
        });
    });

    describe('GET /blogs/:blogId/posts', () => {
        let blogs: BlogOutputDto[] = []; // TODO: сделать отдельный blogs в каждом тесте?
        let blogId: string;
        let posts: PostOutputDto[] = [];

        beforeAll(async () => {
            await clearDb();

            blogs = await testData.createBlogs([1, 2, 3, 4, 5]);
            blogId = blogs[0].id;
            posts = await testData.createPosts(blogId, [1, 2, 3, 4, 5]);
        });

        it('блог не найден', async () => {
            const testId = `1${blogId.slice(1)}`;
            const response = await request(app).get(`${PATHS.blogs}/${testId}/posts`);

            expect(response.status).toBe(HttpStatus.NotFound);
        });

        it('поиск постов без пагинации', async () => {
            const response = await request(app).get(`${PATHS.blogs}/${blogId}/posts`);

            expect(response.status).toBe(HttpStatus.Success);
            expect(response.body).toEqual(mapData(response.body.items));
        });

        it('поиск постов с пагинацией', async () => {
            const query = { pageSize: 3, pageNumber: 2 }; // BlogsSearchParams
            const response = await request(app).get(`${PATHS.blogs}/${blogId}/posts`).query(query);

            expect(response.status).toBe(HttpStatus.Success);
            expect(response.body).toEqual({
                items: [...posts].reverse().slice(-2),
                page: query.pageNumber,
                pageSize: query.pageSize,
                pagesCount: Math.ceil(posts.length / query.pageSize),
                totalCount: posts.length
            });
        });
    });
});
