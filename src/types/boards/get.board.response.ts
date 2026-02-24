import { randomUUID } from 'crypto';

const board = {
    id: randomUUID(),
    name: 'board_1',
    columns: [
        {
            id: randomUUID(),
            name: 'column_1',
            cards: [
                {
                    id: randomUUID(),
                    text: 'card_1'
                }
            ]
        }
    ]
};

export type GetBoardResponseCard = {
    id: string;
    text: string;
}

export type GetBoardResponseColumn = {
    id: string;
    name: string;
    cards: GetBoardResponseCard[];
}

export type GetBoardResponse = {
    id: string;
    name: string;
    columns: GetBoardResponseColumn[];
};