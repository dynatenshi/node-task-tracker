import express from "express";
import { randomUUID } from 'crypto';
import type { Request, Response } from "express";
import type {BoardIdParams, ColumnIdParams} from "../types/common/index.js";
import type { Column, CreateColumnRequest, GetColumnsResponse } from '../types/columns/index.js';
import { createColumn, updateColumn, deleteColumn, getOneColumn, getAllColumns } from '../database/repository/columns.repository.js';
import { validateColumnInput } from "./validation/index.js";

export const columnsRouter = express.Router({ mergeParams: true });

columnsRouter.get(
    '/',
    async (
        request: Request<BoardIdParams, {}>,
        response: Response<GetColumnsResponse>
    ) => {
    const columns = await getAllColumns(request.params.boardId);
    response.send(columns);
});

columnsRouter.get(
    '/:columnId',
    async (
        request: Request<ColumnIdParams, {}>,
        response: Response<Column | string>
    ) => {
    const column = await getOneColumn(request.params.columnId, request.params.boardId);

    if (!column) {
        return response.status(404).send('Column not found');
    }

    response.send(column);
});

columnsRouter.post(
    '/',
    validateColumnInput,
    async (
        request: Request<BoardIdParams, Column, CreateColumnRequest>,
        response: Response<Column>
    ) => {
    const column: Column = {
        name: request.body.name,
        id: randomUUID(),
        boardId: request.params.boardId
    };

    await createColumn(column);

    response.send(column);
});

columnsRouter.put(
    '/:columnId',
    validateColumnInput,
    async (
        request: Request<ColumnIdParams, Column, CreateColumnRequest>,
        response: Response<Column>
    ) => {
    const column: Column = {
        name: request.body.name,
        id: request.params.columnId,
        boardId: request.params.boardId
    };

    await updateColumn(column);

    response.send(column);
});

columnsRouter.delete(
    '/:columnId',
    async (
        request: Request<ColumnIdParams>,
        response: Response<void>
    ) => {
    await deleteColumn(request.params.columnId, request.params.boardId);

    response.sendStatus(204);
});