import type {Board, GetBoardResponse, GetBoardResponseColumn} from "../../types/boards/index.js";
import {sqliteAll, sqliteGet, sqliteRun} from "../db.connection.js";

type OneBoardDatabaseResult = {
    boardId: string;
    boardName: string;
    columnId: string | null;
    columnName: string | null;
    cardId: string | null;
    cardText: string | null;
};

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

export const getOneBoard = async (id: string): Promise<GetBoardResponse | null> => {
    const data = await sqliteAll(`
    SELECT 
        boards.id AS "boardId",
        boards.name AS "boardName",
        columns.id AS "columnId",
        columns.name AS "columnName",
        cards.id AS "cardId",
        cards.text AS "cardText"
    FROM boards
    LEFT JOIN columns ON boards.id = columns.board_id
    LEFT JOIN cards ON columns.id = cards.column_id
    WHERE boards.id = ?
    ORDER BY columns.name ASC NULLS LAST,
    columns.id ASC,
    cards.text ASC NULLS LAST;
    `, [id]);

    if (!OneBoardDatabaseResult(data) || !data.length) {
        return null;
    }

    return mapOneBoardResult(data);
}

const mapOneBoardResult = (data: OneBoardDatabaseResult[]): GetBoardResponse => {
    const columns: GetBoardResponseColumn[] = [];
    let column: GetBoardResponseColumn | undefined;

    for (const row of data) {
        if (!row.columnId) break;
        if (!column) {
            column = {
                id: row.columnId!,
                name: row.columnName!,
                cards: []
            };
        }

        if (column.id !== row.columnId) {
            columns.push(column);
            column = {
                id: row.columnId!,
                name: row.columnName!,
                cards: []
            };
        }

        if (!row.cardId) continue;

        column.cards.push({
           id: row.cardId,
           text: row.cardText!
        });
    }

    if (column) columns.push(column);

    return {
        id: data[0].boardId,
        name: data[0].boardName,
        columns
    }
};

export const getAllBoards = async (): Promise<Board[]> => {
    const data = await sqliteAll(`
        SELECT boards.* FROM boards;
    `);

    return data.map(el => ({
       id: el.id,
       name: el.name
    }));
}

const OneBoardDatabaseResult = (data: unknown): data is OneBoardDatabaseResult[] => {
    if (!Array.isArray(data)) {
        console.error(`Unknown data format on get board: ${data}`);
        throw new Error('Unknown data format');
    }

    const board = data as OneBoardDatabaseResult[];

    for (const row of board) {
        if (!row || !row.boardId || !row.boardName) {
            return false;
        }
    }

    return true;
}