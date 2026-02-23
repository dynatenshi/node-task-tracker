import express from 'express';
import { PORT } from "./config.js";
import { cardsRouter } from "./routers/cards.router.js";
import { createTables } from "./database/create.tables.js";

const server = express();
server.use(express.json());

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