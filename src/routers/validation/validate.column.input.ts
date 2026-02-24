import type { Request, Response } from "express";
import type {IdParams} from "../../types/common/index.js";
import type {Column, CreateColumnRequest} from "../../types/columns/index.js";

export const validateColumnInput = (
    { body }: Request<IdParams, Column, CreateColumnRequest>,
    response: Response,
    next: () => void
): void => {
    if (typeof body !== 'object' || !body.name || typeof body.name !== 'string') {
        response.status(400).send({
            error: 'Validation error'
        });

        return;
    }
    next();
};