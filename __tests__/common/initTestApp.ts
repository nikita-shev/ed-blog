import express from 'express';
import request from 'supertest';
import { setupApp } from '../../src/setup-app';
import { runDB } from '../../src/db/db.config';
import { PATHS } from '../../src/core/constants/paths';

export function initTestApp() {
    const app = express();
    setupApp(app);

    return {
        app,
        async runDB() {
            await runDB(process.env.MONGO_URL_TEST);
        },
        async clearDb() {
            await request(app).delete(`${PATHS.testing}/all-data`);
        }
    };
}
