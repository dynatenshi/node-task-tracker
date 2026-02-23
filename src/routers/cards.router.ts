import express from "express";
import { randomUUID } from 'crypto';
import type { Request, Response } from "express";
import type { IdParams } from "../types/common/index.js";
import type { Card, CreateCardRequest, GetCardsResponse } from '../types/cards/index.js';
import { createCard, updateCard, deleteCard, getOneCard, getAllCards } from "../database/repository/cards.repository.js";

export const cardsRouter = express.Router();

cardsRouter.get('/', async (request: Request<{}, {}>, response: Response<GetCardsResponse> ) => {
    const cards = await getAllCards();
    response.send(cards);
});

cardsRouter.get('/:id', async (request: Request<IdParams, {}>, response: Response<Card | string>) => {
    const card = await getOneCard(request.params.id);

    if (!card) {
        return response.status(404).send('Card not found');
    }

    response.send(card);
});

cardsRouter.post('/', async (request: Request<{}, Card, CreateCardRequest>, response: Response<Card>) => {
    const card: Card = {
        text: request.body.text,
        id: randomUUID()
    };

    await createCard(card);

    response.send(card);
});

cardsRouter.put('/:id', async (request: Request<IdParams, Card, CreateCardRequest>, response: Response<Card>) => {
    const card: Card = {
        text: request.body.text,
        id: request.params.id
    };

    await updateCard(card);

    response.send(card);
});

cardsRouter.delete('/:id', async (request: Request<IdParams>, response: Response<void>) => {
    await deleteCard(request.params.id);

    response.sendStatus(204);
});