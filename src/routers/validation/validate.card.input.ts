import type { Request, Response } from "express";
import type {CardIdParams} from "../../types/common/index.js";
import type {Card, CreateCardRequest} from "../../types/cards/index.js";

export const validateCardInput = (
    { body }: Request<CardIdParams, Card, CreateCardRequest>,
    response: Response,
    next: () => void
): void => {
    if (typeof body !== 'object' || !body.text || typeof body.text !== 'string') {
        response.status(400).send({
            error: 'Validation error'
        });

        return;
    }
    next();
};