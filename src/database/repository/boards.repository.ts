import type {Board} from "../../types/boards/index.js";
import {sqliteAll, sqliteGet, sqliteRun} from "../db.connection.js";

export const createBoard = async (board: Board): Promise<void> => {
    await sqliteRun(`
    INSERT INTO boards (id, name)
    VALUES (?, ?);
    `, [board.id, board.name]);
}

export const updateBoard = async (board: Board): Promise<void> => {
    await sqliteRun(`
    UPDATE boards SET name = ?
    WHERE id = ?;
    `, [board.name, board.id]);
}

export const deleteBoard = async (id: string): Promise<void> => {
    await sqliteRun(`
    DELETE FROM boards
    WHERE id = ?;
    `, [id]);
}

export const getOneBoard = async (id: string): Promise<Board | null> => {
    const data = await sqliteGet(`
    SELECT * FROM boards
    WHERE id = ?;
    `, [id]);

    if (isBoard(data)) {
        return data;
    }

    return null;
}

export const getAllBoards = async (): Promise<Board[]> => {
    const data = await sqliteAll(`
    SELECT * FROM boards;
    `);

    if (!Array.isArray(data)) {
        console.error(`Unknown data format on getAll: ${data}`);
        throw new Error('Unknown data format on getAll');
    }

    return data.map(el => {
        if (isBoard(el))
            return el;

        return undefined;
    }).filter(el => el !== undefined);
}

const isBoard = (data: unknown): data is Board => {
    const board: Board = data as Board;
    return Boolean(board && typeof board === 'object' && board.id && board.name);
}