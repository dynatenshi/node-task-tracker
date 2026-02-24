import express from "express";
import { randomUUID } from 'crypto';
import type { Request, Response } from "express";
import type {CardIdParams, ColumnIdParams} from "../types/common/index.js";
import type { Card, CreateCardRequest, GetCardsResponse } from '../types/cards/index.js';
import { createCard, updateCard, deleteCard, getOneCard, getAllCards } from "../database/repository/cards.repository.js";
import { validateCardInput } from "./validation/index.js";

export const cardsRouter = express.Router({ mergeParams: true });

cardsRouter.get('/', async (request: Request<ColumnIdParams, {}>, response: Response<GetCardsResponse> ) => {
    const cards = await getAllCards(request.params.columnId, request.params.boardId);
    response.send(cards);
});

cardsRouter.get(
    '/:cardId',
    async (
        request: Request<CardIdParams, {}>,
        response: Response<Card | string>
    ) => {
    const card = await getOneCard(request.params.cardId, request.params.columnId, request.params.boardId);

    if (!card) {
        return response.status(404).send('Card not found');
    }

    response.send(card);
});

cardsRouter.post(
    '/',
    validateCardInput,
    async (
        request: Request<ColumnIdParams, Card, CreateCardRequest>,
        response: Response<Card>
    ) => {
    const card: Card = {
        text: request.body.text,
        id: randomUUID(),
        columnId: request.params.columnId,
        boardId: request.params.boardId
    };

    await createCard(card);

    response.send(card);
});

cardsRouter.put(
    '/:cardId',
    validateCardInput,
    async (
        request: Request<CardIdParams, Card, CreateCardRequest>,
        response: Response<Card>
    ) => {
    const card: Card = {
        text: request.body.text,
        id: request.params.cardId,
        columnId: request.params.columnId,
        boardId: request.params.boardId
    };

    await updateCard(card);

    response.send(card);
});

cardsRouter.delete(
    '/:cardId',
    async (
        request: Request<CardIdParams>,
        response: Response<void>
    ) => {
    await deleteCard(request.params.cardId, request.params.columnId, request.params.boardId);

    response.sendStatus(204);
});