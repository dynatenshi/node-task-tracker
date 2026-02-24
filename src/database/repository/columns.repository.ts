import type {Column} from "../../types/columns/index.js";
import {sqliteAll, sqliteGet, sqliteRun} from "../db.connection.js";

export const createColumn = async (column: Column): Promise<void> => {
    await sqliteRun(`
    INSERT INTO columns (id, name, board_id)
    VALUES (?, ?, ?);
    `, [column.id, column.name, column.boardId]);
}

export const updateColumn = async (column: Column): Promise<void> => {
    await sqliteRun(`
    UPDATE columns SET name = ?
    WHERE id = ? AND board_id = ?;
    `, [column.name, column.id, column.boardId]);
}

export const deleteColumn = async (id: string, boardId: string): Promise<void> => {
    await sqliteRun(`
    DELETE FROM columns
    WHERE id = ? AND board_id = ?;
    `, [id, boardId]);
}

export const getOneColumn = async (id: string, boardId: string): Promise<Column | null> => {
    const data = await sqliteGet(`
    SELECT * FROM columns
    WHERE id = ? AND board_id = ?;
    `, [id, boardId]);

    if (isColumn(data)) {
        return data;
    }

    return null;
}

export const getAllColumns = async (boardId: string): Promise<Column[]> => {
    const data = await sqliteAll(`
    SELECT * FROM columns
    WHERE board_id = ?;
    `, [boardId]);

    if (!Array.isArray(data)) {
        console.error(`Unknown data format on getAll: ${data}`);
        throw new Error('Unknown data format on getAll');
    }

    return data.map(el => {
        if (isColumn(el))
            return el;

        return undefined;
    }).filter(el => el !== undefined);
}

const isColumn = (data: unknown): data is Column => {
    const column: Column = data as Column;
    return Boolean(column && typeof column === 'object' && column.id && column.name);
}