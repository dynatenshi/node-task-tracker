import express from "express";
import { randomUUID } from 'crypto';
import type { Request, Response } from "express";
import type { IdParams } from "../types/common/index.js";
import type { Board, CreateBoardRequest, GetBoardsResponse } from '../types/boards/index.js';
import { createBoard, updateBoard, deleteBoard, getOneBoard, getAllBoards } from "../database/repository/boards.repository.js";
import { validateBoardInput } from "./validation/index.js";

export const boardsRouter = express.Router();

boardsRouter.get('/', async (request: Request<{}, {}>, response: Response<GetBoardsResponse> ) => {
    const boards = await getAllBoards();
    response.send(boards);
});

boardsRouter.get('/:id', async (request: Request<IdParams, {}>, response: Response<Board | string>) => {
    const board = await getOneBoard(request.params.id);

    if (!board) {
        return response.status(404).send('Board not found');
    }

    response.send(board);
});

boardsRouter.post(
    '/',
    validateBoardInput,
    async (request: Request<{}, Board, CreateBoardRequest>, response: Response<Board>) => {
    const board: Board = {
        name: request.body.name,
        id: randomUUID()
    };

    await createBoard(board);

    response.send(board);
});

boardsRouter.put(
    '/:id',
    validateBoardInput,
    async (request: Request<IdParams, Board, CreateBoardRequest>, response: Response<Board>) => {
    const board: Board = {
        name: request.body.name,
        id: request.params.id
    };

    await updateBoard(board);

    response.send(board);
});

boardsRouter.delete('/:id', async (request: Request<IdParams>, response: Response<void>) => {
    await deleteBoard(request.params.id);

    response.sendStatus(204);
});