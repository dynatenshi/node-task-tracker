import { sqliteRun } from "./db.connection.js";

export const createTables = async (): Promise<void> => {
    await sqliteRun(`
    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL  
    );
    `);
}