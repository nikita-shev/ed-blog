import express from 'express';
import { setupApp } from './setup-app';

const app = express();
const PORT = process.env.PORT || 3000;

setupApp(app);

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
