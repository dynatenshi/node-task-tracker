import type { Request, Response } from "express";
import type {BoardIdParams} from "../../types/common/index.js";
import type {Board, CreateBoardRequest} from "../../types/boards/index.js";

export const validateBoardInput = (
    { body }: Request<BoardIdParams, Board, CreateBoardRequest>,
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