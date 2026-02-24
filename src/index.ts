import express from 'express';
import { PORT, ADMIN_LOGIN, ADMIN_PASSWORD } from "./config.js";
import { cardsRouter } from "./routers/cards.router.js";
import { createTables } from "./database/create.tables.js";
import basicAuth from 'express-basic-auth';

const server = express();
server.use(express.json());
server.use(basicAuth({
    users: { [ADMIN_LOGIN]: ADMIN_PASSWORD },
    challenge: true
}));

async function run() {
    await createTables();

    server.get('/', (request, response) => {
        response.status(200).send('<h1>Hi!</h1>');
    })

    server.use('/cards', cardsRouter);

    server.listen(PORT, () => {
        console.log(`Server started at: http://localhost:${PORT}`);
    });
}

run().catch(error => {
    console.error(error);
});