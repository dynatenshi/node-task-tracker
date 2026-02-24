import type { Request, Response, NextFunction } from 'express';
import type {CardIdParams} from "../../types/common/index.js";
import {getOneCard} from "../../database/repository/cards.repository.js";

export const checkCardExistence = async (
    {params}: Request<CardIdParams>,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const card = await getOneCard(params);
    if (card) {
        next();
        return;
    }

    response.status(404).send('Card not found');
};