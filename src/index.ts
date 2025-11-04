import express from 'express';
import { setupApp } from './setup-app';
import { runDB } from './db/db.config';

async function startApp() {
    const app = express();
    const PORT = process.env.PORT || 3000;

    setupApp(app);
    await runDB();

    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}
startApp();
