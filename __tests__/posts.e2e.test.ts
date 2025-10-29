import express from 'express';
import request from 'supertest';
import { setupApp } from '../src/setup-app';
import { PATHS } from '../src/core/constants/paths';
import { HttpStatus } from '../src/core/constants/http-statuses';
import { BlogInputDto } from '../src/blogs/dto';
import { PostInputDto } from '../src/posts/dto';

describe('Tests path "/blogs"', () => {
    const app = express();
    setupApp(app);

    beforeAll(async () => {
        await request(app).delete(`${PATHS.testing}/all-data`).expect(HttpStatus.NoContent);
    });

    it('test GET /posts', async () => {
        const response = await request(app).get(`${PATHS.posts}`);

        expect(response.status).toBe(HttpStatus.Ok);
        expect(response.body).toEqual([]);
    });

    let postId: string;
    it('test POST /posts', async () => {
        const newPost: PostInputDto = {
            title: 'Title',
            shortDescription: 'shortDescription',
            content: 'content',
            blogId: '213'
        };

        const response = await request(app).post(`${PATHS.posts}/`).send(newPost);
        expect(response.status).toBe(HttpStatus.Unauthorized);

        const response2 = await request(app)
            .post(`${PATHS.posts}/`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newPost);
        postId = response2.body.id;
        expect(response2.status).toBe(HttpStatus.Created);
        expect(response2.body).toEqual({ id: expect.any(String), blogName: 'Test', ...newPost });

        const incorrectData = {
            // title: '',
            shortDescription: 123,
            content: '                                                       ',
            blogId: 222
        };
        const response3 = await request(app)
            .post(`${PATHS.posts}/`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectData);

        expect(response3.status).toBe(HttpStatus.BadRequest);
        expect(response3.body).toEqual({
            errorsMessages: [
                {
                    field: 'title',
                    message: 'Title is required'
                },
                {
                    field: 'shortDescription',
                    message: 'shortDescription must be a string'
                },
                {
                    field: 'content',
                    message: 'Min length is 1 characters'
                },
                {
                    field: 'blogId',
                    message: 'blogId must be a string'
                }
            ]
        });
    });

    it('test GET /posts/:id', async () => {
        const response = await request(app).get(`${PATHS.posts}/11e`);
        expect(response.status).toBe(HttpStatus.NotFound);

        const response2 = await request(app).get(`${PATHS.posts}/${postId}`);
        expect(response2.status).toBe(HttpStatus.Ok);
        expect(response2.body.title).toBe('Title');
    });

    it('test PUT /blogs/:id', async () => {
        const newData: PostInputDto = {
            title: 'Title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: '213'
        };

        const response = await request(app).put(`${PATHS.posts}/${postId}`).send(newData);
        expect(response.status).toBe(HttpStatus.Unauthorized);

        const response2 = await request(app)
            .put(`${PATHS.posts}/11ee`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newData);
        expect(response2.status).toBe(HttpStatus.NotFound);

        const response3 = await request(app)
            .put(`${PATHS.posts}/${postId}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newData);
        expect(response3.status).toBe(HttpStatus.NoContent);

        const content = (() => [...new Array(1001).fill('i')].join(' '))();
        const incorrectData = {
            title: 123,
            // shortDescription: 123,
            content
            // blogId: 222
        };
        const response4 = await request(app)
            .put(`${PATHS.posts}/${postId}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectData);

        expect(response4.status).toBe(HttpStatus.BadRequest);
        expect(response4.body).toEqual({
            errorsMessages: [
                {
                    field: 'title',
                    message: 'Title must be a string'
                },
                {
                    field: 'shortDescription',
                    message: 'shortDescription is required'
                },
                {
                    field: 'content',
                    message: 'Max length is 1000 characters'
                },
                {
                    field: 'blogId',
                    message: 'blogId is required'
                }
            ]
        });
    });

    it('test DELETE /posts/:id', async () => {
        const response = await request(app).delete(`${PATHS.posts}/${postId}`);
        expect(response.status).toBe(HttpStatus.Unauthorized);

        const response2 = await request(app)
            .delete(`${PATHS.posts}/112ee`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5');
        expect(response2.status).toBe(HttpStatus.NotFound);

        const response3 = await request(app)
            .delete(`${PATHS.posts}/${postId}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5');
        expect(response3.status).toBe(HttpStatus.NoContent);

        const responseGet = await request(app).get(`${PATHS.posts}/${postId}`);
        expect(responseGet.status).toBe(HttpStatus.NotFound);
    });
});
