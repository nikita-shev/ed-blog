import express from 'express';
import request from 'supertest';
import { setupApp } from '../src/setup-app';
import { PATHS } from '../src/core/constants/paths';
import { HttpStatus } from '../src/core/constants/http-statuses';
import { BlogInputDto } from '../src/blogs/dto';
import { runDB } from '../src/db/db.config';

describe('Tests path "/blogs"', () => {
    const app = express();
    setupApp(app);

    beforeAll(async () => {
        await runDB();
        await request(app).delete(`${PATHS.testing}/all-data`).expect(HttpStatus.NoContent);
    });

    it('test GET /blogs', async () => {
        const response = await request(app).get(`${PATHS.blogs}`);

        expect(response.status).toBe(HttpStatus.Ok);
        expect(response.body).toEqual([]);
    });

    let blogId: string;
    it('test POST /blogs', async () => {
        const newBlog: BlogInputDto = {
            name: 'Cup',
            description: 'cup',
            websiteUrl: 'https://www.cup.com'
        };

        const response = await request(app).post(`${PATHS.blogs}/`).send(newBlog);
        expect(response.status).toBe(HttpStatus.Unauthorized);

        const response2 = await request(app)
            .post(`${PATHS.blogs}/`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newBlog);
        blogId = response2.body.id;
        expect(response2.status).toBe(HttpStatus.Created);
        expect(response2.body).toEqual({
            id: expect.any(String),
            isMembership: expect.any(Boolean),
            createdAt: expect.any(String),
            ...newBlog
        });

        const incorrectData = {
            name: 'CupCupCupCupCupCupCupCupCupCupCupCupCupCup',
            // description: 123,
            websiteUrl: 'htt://cupm'
        };
        const response3 = await request(app)
            .post(`${PATHS.blogs}/`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectData);

        expect(response3.status).toBe(HttpStatus.BadRequest);
        expect(response3.body).toEqual({
            errorsMessages: [
                {
                    field: 'websiteUrl',
                    message: 'websiteUrl is incorrect'
                },
                {
                    field: 'name',
                    message: 'Max length is 15 characters'
                },
                {
                    field: 'description',
                    message: 'Description is required'
                }
            ]
        });
    });

    it('test GET /blogs/:id', async () => {
        const response = await request(app).get(`${PATHS.blogs}/11e`);
        expect(response.status).toBe(HttpStatus.BadRequest);
        expect(response.body).toEqual({
            errorsMessages: [
                {
                    field: 'id',
                    message: 'id is incorrect'
                }
            ]
        });

        const testId = `1${blogId.slice(1)}`;
        const response2 = await request(app).get(`${PATHS.blogs}/${testId}`);
        expect(response2.status).toBe(HttpStatus.NotFound);

        const response3 = await request(app).get(`${PATHS.blogs}/${blogId}`);
        expect(response3.status).toBe(HttpStatus.Ok);
        expect(response3.body.name).toBe('Cup');
    });

    it('test PUT /blogs/:id', async () => {
        const newData: BlogInputDto = {
            name: 'Cup2',
            description: 'cup2',
            websiteUrl: 'https://www.cup2.com'
        };

        const response = await request(app).put(`${PATHS.blogs}/${blogId}`).send(newData);
        expect(response.status).toBe(HttpStatus.Unauthorized);

        const response2 = await request(app)
            .put(`${PATHS.blogs}/11ee`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newData);
        expect(response2.status).toBe(HttpStatus.BadRequest);
        expect(response2.body).toEqual({
            errorsMessages: [
                {
                    field: 'id',
                    message: 'id is incorrect'
                }
            ]
        });

        const testId = `1${blogId.slice(1)}`;
        const response3 = await request(app)
            .put(`${PATHS.blogs}/${testId}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newData);
        expect(response3.status).toBe(HttpStatus.NotFound);

        const response4 = await request(app)
            .put(`${PATHS.blogs}/${blogId}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newData);
        expect(response4.status).toBe(HttpStatus.NoContent);

        const incorrectData = {
            name: 'CupCupCupCupCupCupCupCupCupCupCupCupCupCup2',
            // description: 123,
            websiteUrl: 'htt://cup2m'
        };
        const response5 = await request(app)
            .put(`${PATHS.blogs}/${blogId}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectData);
        expect(response5.status).toBe(HttpStatus.BadRequest);
        expect(response5.body).toEqual({
            errorsMessages: [
                {
                    field: 'websiteUrl',
                    message: 'websiteUrl is incorrect'
                },
                {
                    field: 'name',
                    message: 'Max length is 15 characters'
                },
                {
                    field: 'description',
                    message: 'Description is required'
                }
            ]
        });
    });

    it('test DELETE /blogs/:id', async () => {
        const response = await request(app).delete(`${PATHS.blogs}/${blogId}`);
        expect(response.status).toBe(HttpStatus.Unauthorized);

        const response2 = await request(app)
            .delete(`${PATHS.blogs}/112ee`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5');
        expect(response2.status).toBe(HttpStatus.BadRequest);
        expect(response2.body).toEqual({
            errorsMessages: [
                {
                    field: 'id',
                    message: 'id is incorrect'
                }
            ]
        });

        const testId = `1${blogId.slice(1)}`;
        const response3 = await request(app)
            .delete(`${PATHS.blogs}/${testId}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5');
        expect(response3.status).toBe(HttpStatus.NotFound);

        const response4 = await request(app)
            .delete(`${PATHS.blogs}/${blogId}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5');
        expect(response4.status).toBe(HttpStatus.NoContent);

        const responseGet = await request(app).get(`${PATHS.blogs}/${blogId}`);
        expect(responseGet.status).toBe(HttpStatus.NotFound);
    });
});
