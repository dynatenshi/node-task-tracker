import type { Request, Response, NextFunction } from 'express';
import type {ColumnIdParams} from "../../types/common/index.js";
import {getOneColumn} from "../../database/repository/columns.repository.js";

export const checkColumnExistence = async (
    request: Request<ColumnIdParams>,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const column = await getOneColumn(request.params.columnId, request.params.boardId);
    if (column) {
        next();
        return;
    }

    response.status(404).send('Column not found');
};