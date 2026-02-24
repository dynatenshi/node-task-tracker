import type {Card} from "../../types/cards/index.js";
import type {CardIdParams, ColumnIdParams} from "../../types/common/index.js";
import {sqliteAll, sqliteGet, sqliteRun} from "../db.connection.js";

export const createCard = async (card: Card): Promise<void> => {
    await sqliteRun(
        `
    INSERT INTO cards (id, text, column_id)
    VALUES (?, ?, ?);
    `, [card.id, card.text, card.columnId]);
}

export const updateCard = async (card: Card): Promise<void> => {
    await sqliteRun(
        `
    UPDATE cards SET text = ?
    WHERE id = ?;
    `, [card.text, card.id]);
}

export const deleteCard = async (id: string): Promise<void> => {
    await sqliteRun(
        `
    DELETE FROM cards
    WHERE id = ?;
    `, [id]);
}

export const getOneCard = async ({ cardId, columnId, boardId } :CardIdParams): Promise<Card | null> => {
    const data = await sqliteGet(
        `
    SELECT cards.* FROM cards
    LEFT JOIN columns 
    ON cards.column_id = columns.id
    WHERE cards.column_id = ? AND columns.id =? AND columns.board_id = ?;
    `, [cardId, columnId, boardId]);

    if (isCard(data)) {
        return data;
    }

    return null;
}

export const getAllCards = async ({ columnId, boardId }: ColumnIdParams): Promise<Card[]> => {
    const data = await sqliteAll(
        `
    SELECT cards.* FROM cards
    LEFT JOIN columns
    ON cards.column_id = columns.id
    WHERE cards.column_id = ? AND columns.board_id = ?;
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