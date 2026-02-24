import express from 'express';
import { PORT, ADMIN_LOGIN, ADMIN_PASSWORD } from "./config.js";
import { cardsRouter } from "./routers/cards.router.js";
import { boardsRouter } from "./routers/boards.router.js";
import { columnsRouter } from "./routers/columns.router.js";
import { createTables } from "./database/create.tables.js";
import basicAuth from 'express-basic-auth';
import { logger } from './logger.js';

const server = express();
server.use(basicAuth({
    users: { [ADMIN_LOGIN]: ADMIN_PASSWORD },
    challenge: true
}));
server.use(express.json());
server.use(logger);

async function run() {
    await createTables();

    server.get('/', (request, response) => {
        response.status(200).send('<h1>Hi!</h1>');
    })

    server.use('/boards', boardsRouter);
    server.use('/boards/:boardId/columns', columnsRouter);
    server.use('/boards/:boardId/columns/:columnId/cards', cardsRouter);

    server.listen(PORT, () => {
        console.log(`Server started at: http://localhost:${PORT}`);
    });
}

run().catch(error => {
    console.error(error);
});