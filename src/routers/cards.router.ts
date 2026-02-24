import express from "express";
import { randomUUID } from 'crypto';
import type { Request, Response } from "express";
import type {CardIdParams, ColumnIdParams} from "../types/common/index.js";
import type {Card, CreateCardRequest, GetCardsResponse, UpdateCardRequest} from '../types/cards/index.js';
import { createCard, updateCard, deleteCard, getOneCard, getAllCards } from "../database/repository/cards.repository.js";
import { validateCardInput } from "./validation/index.js";
import {checkCardExistence, checkColumnExistence} from "./middleware/index.js";
import {getOneColumn} from "../database/repository/columns.repository.js";

export const cardsRouter = express.Router({ mergeParams: true });

cardsRouter.get('/', async (request: Request<ColumnIdParams, {}>, response: Response<GetCardsResponse> ) => {
    const cards = await getAllCards(request.params);
    response.send(cards);
});

cardsRouter.get(
    '/:cardId',
    async (
        request: Request<CardIdParams, {}>,
        response: Response<Card | string>
    ) => {
    const card = await getOneCard(request.params);

    if (!card) {
        return response.status(404).send('Card not found');
    }

    response.send(card);
});

cardsRouter.post(
    '/',
    validateCardInput,
    checkColumnExistence,
    async (
        request: Request<ColumnIdParams, Card, CreateCardRequest>,
        response: Response<Card>
    ) => {
    const card: Card = {
        text: request.body.text,
        id: randomUUID(),
        columnId: request.params.columnId
    };

    await createCard(card);

    response.send(card);
});

cardsRouter.put(
    '/:cardId',
    validateCardInput,
    checkCardExistence,
    async (
        request: Request<CardIdParams, Card, UpdateCardRequest>,
        response: Response<Card | string>
    ) => {
        if (request.params.columnId !== request.body.columnId) {
            const column = await getOneColumn(request.params.columnId, request.params.boardId);
            if (!column) {
                response.status(404).send('Column not found');
                return;
            }
        }

        const card: Card = {
            text: request.body.text,
            id: request.params.cardId,
            columnId: request.body.columnId
        };

        await updateCard(card);

        response.send(card);
    });

cardsRouter.delete(
    '/:cardId',
    checkCardExistence,
    async (
        request: Request<CardIdParams>,
        response: Response<void>
    ) => {
    await deleteCard(request.params.cardId);

    response.sendStatus(204);
});