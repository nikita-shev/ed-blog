import request from 'supertest';
import { PATHS } from '../../src/core/constants/paths';
import { HttpStatus } from '../../src/core/constants/http-statuses';
import { PostInputDto, PostOutputDto } from '../../src/posts/dto';
import { initTestApp } from '../common/initTestApp';
import { authorizationData, incorrectId } from '../common/constants/mock-data';
import {
    incorrectField,
    maxFieldLengthExceeded,
    minFieldLengthExceeded,
    mustBeString,
    requiredField
} from '../common/utils/errors';
import { TestData } from '../common/utils/test-data';

describe('Tests path "/posts"', () => {
    const { app, runDB, clearDb } = initTestApp();
    const testData = new TestData(app);

    beforeAll(async () => {
        await runDB();
        await clearDb();
    });

    describe('POST /posts', () => {
        const newPost: PostInputDto = {
            title: 'Title',
            shortDescription: 'shortDescription',
            content: 'content',
            blogId: '213'
        };

        it('проверка отсутствия авторизации', async () => {
            const response = await request(app).post(`${PATHS.posts}/`).send(newPost);
            expect(response.status).toBe(HttpStatus.Unauthorized);
        });

        it('проверка входных данных', async () => {
            const incorrectData = {
                // title: '',
                shortDescription: 123,
                content: '                                                       ',
                blogId: 222
            };

            const response = await request(app)
                .post(`${PATHS.posts}/`)
                .set('Authorization', authorizationData)
                .send(incorrectData);

            expect(response.status).toBe(HttpStatus.BadRequest);
            expect(response.body).toEqual({
                errorsMessages: [
                    requiredField('title'),
                    mustBeString('shortDescription'),
                    minFieldLengthExceeded('content'),
                    mustBeString('blogId')
                ]
            });
        });

        it('создание поста', async () => {
            const response = await request(app)
                .post(`${PATHS.posts}/`)
                .set('Authorization', authorizationData)
                .send(newPost);

            expect(response.status).toBe(HttpStatus.Created);
            expect(response.body).toEqual({
                id: expect.any(String),
                blogName: 'Test',
                createdAt: expect.any(String),
                ...newPost
            });
        });
    });

    describe('GET /posts/:id', () => {
        let post: PostOutputDto;

        beforeAll(async () => {
            await clearDb();

            post = await testData.createPost();
        });

        it('неверный формат id поста', async () => {
            const response = await request(app).get(`${PATHS.posts}/${incorrectId}`);

            expect(response.status).toBe(HttpStatus.BadRequest);
            expect(response.body).toEqual({
                errorsMessages: [incorrectField('id')]
            });
        });

        it('пост не найден', async () => {
            const testId = `1${post.id.slice(1)}`;
            const response = await request(app).get(`${PATHS.posts}/${testId}`);

            expect(response.status).toBe(HttpStatus.NotFound);
        });

        it('пост найден', async () => {
            const response = await request(app).get(`${PATHS.posts}/${post.id}`);

            expect(response.status).toBe(HttpStatus.Success);
            expect(response.body.title).toBe(post.title);
        });
    });

    describe('PUT /posts/:id', () => {
        const newData: PostInputDto = {
            title: 'Title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: '213'
        };
        let post: PostOutputDto;

        beforeAll(async () => {
            await clearDb();

            post = await testData.createPost();
        });

        it('проверка авторизации', async () => {
            const response = await request(app).put(`${PATHS.posts}/${post.id}`).send(newData);

            expect(response.status).toBe(HttpStatus.Unauthorized);
        });

        it('проверка формата id поста', async () => {
            const response = await request(app)
                .put(`${PATHS.posts}/${incorrectId}`)
                .set('Authorization', authorizationData)
                .send(newData);

            expect(response.status).toBe(HttpStatus.BadRequest);
            expect(response.body).toEqual({
                errorsMessages: [incorrectField('id')]
            });
        });

        it('пост не найден', async () => {
            const testId = `1${post.id.slice(1)}`;
            const response = await request(app)
                .put(`${PATHS.posts}/${testId}`)
                .set('Authorization', authorizationData)
                .send(newData);

            expect(response.status).toBe(HttpStatus.NotFound);
        });

        it('проверка входящих данных', async () => {
            const content = (() => [...new Array(1001).fill('i')].join(' '))();
            const incorrectData = {
                title: 123,
                // shortDescription: 123,
                content
                // blogId: 222
            };
            const response = await request(app)
                .put(`${PATHS.posts}/${post.id}`)
                .set('Authorization', authorizationData)
                .send(incorrectData);

            expect(response.status).toBe(HttpStatus.BadRequest);
            expect(response.body).toEqual({
                errorsMessages: [
                    mustBeString('title'),
                    requiredField('shortDescription'),
                    maxFieldLengthExceeded('content', 1000),
                    requiredField('blogId')
                ]
            });
        });

        it('пост обновлен', async () => {
            const response = await request(app)
                .put(`${PATHS.posts}/${post.id}`)
                .set('Authorization', authorizationData)
                .send(newData);

            expect(response.status).toBe(HttpStatus.NoContent);
        });
    });

    describe('DELETE /posts/:id', () => {
        let post: PostOutputDto;

        beforeAll(async () => {
            await clearDb();

            post = await testData.createPost();
        });

        it('проверка авторизации', async () => {
            const response = await request(app).delete(`${PATHS.posts}/${post.id}`);

            expect(response.status).toBe(HttpStatus.Unauthorized);
        });

        it('проверка формата id поста', async () => {
            const response = await request(app)
                .delete(`${PATHS.posts}/${incorrectId}`)
                .set('Authorization', authorizationData);

            expect(response.status).toBe(HttpStatus.BadRequest);
            expect(response.body).toEqual({
                errorsMessages: [incorrectField('id')]
            });
        });

        it('пост не найден', async () => {
            const testId = `1${post.id.slice(1)}`;
            const response3 = await request(app)
                .delete(`${PATHS.posts}/${testId}`)
                .set('Authorization', authorizationData);

            expect(response3.status).toBe(HttpStatus.NotFound);
        });

        it('пост удален', async () => {
            const response = await request(app)
                .delete(`${PATHS.posts}/${post.id}`)
                .set('Authorization', authorizationData);

            expect(response.status).toBe(HttpStatus.NoContent);
        });

        it('проверка удалился ли пост', async () => {
            const response = await request(app).get(`${PATHS.posts}/${post.id}`);

            expect(response.status).toBe(HttpStatus.NotFound);
        });
    });

    describe('GET /posts', () => {
        let posts: PostOutputDto[] = [];

        beforeAll(async () => {
            await clearDb();

            const blogs = await testData.createBlogs([1]);
            const blogId = blogs[0].id;

            posts = await testData.createPosts(blogId, [1, 2, 3, 4, 5]);
        });

        it('поиск постов без пагинации', async () => {
            const response = await request(app).get(`${PATHS.posts}`);

            expect(response.status).toBe(HttpStatus.Success);
            expect(response.body).toEqual({
                items: [...posts].reverse(),
                page: 1,
                pageSize: 10,
                pagesCount: Math.ceil(posts.length / 10),
                totalCount: posts.length
            });
        });

        it('поиск постов с пагинацией', async () => {
            const query = { pageSize: 3, pageNumber: 2 };
            const response = await request(app).get(`${PATHS.posts}`).query(query);

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

    // describe('POST /posts/:postId/comments', () => {
    //
    // })

    // describe('GET /posts/:postId/comments', () => {
    //
    // })
});
