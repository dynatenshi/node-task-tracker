import type {Card} from "../../types/cards/index.js";
import {sqliteAll, sqliteGet, sqliteRun} from "../db.connection.js";

export const createCard = async (card: Card): Promise<void> => {
    await sqliteRun(`
    INSERT INTO cards (id, text, column_id, board_id)
    VALUES (?, ?, ?, ?);
    `, [card.id, card.text, card.columnId, card.boardId]);
}

export const updateCard = async (card: Card): Promise<void> => {
    await sqliteRun(`
    UPDATE cards SET text = ?
    WHERE id = ? AND column_id =? AND board_id = ?;
    `, [card.text, card.id, card.columnId, card.boardId]);
}

export const deleteCard = async (id: string, columnId: string, boardId: string): Promise<void> => {
    await sqliteRun(`
    DELETE FROM cards
    WHERE id = ? AND column_id =? AND board_id = ?;
    `, [id, columnId, boardId]);
}

export const getOneCard = async (id: string, columnId: string, boardId: string): Promise<Card | null> => {
    const data = await sqliteGet(`
    SELECT * FROM cards
    WHERE id = ? AND column_id =? AND board_id = ?;
    `, [id, columnId, boardId]);

    if (isCard(data)) {
        return data;
    }

    return null;
}

export const getAllCards = async (columnId: string, boardId: string): Promise<Card[]> => {
    const data = await sqliteAll(`
    SELECT * FROM cards
    WHERE column_id = ? AND board_id = ?;
    `, [columnId, boardId]);

    if (!Array.isArray(data)) {
        console.error(`Unknown data format on getAll: ${data}`);
        throw new Error('Unknown data format on getAll');
    }

    return data.map(el => {
        if (isCard(el))
            return el;

        return undefined;
    }).filter(el => el !== undefined);
}

const isCard = (data: unknown): data is Card => {
    const card: Card = data as Card;
    return Boolean(card && typeof card === 'object' && card.id && card.text);
}