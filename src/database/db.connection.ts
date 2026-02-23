import sqlite3 from "sqlite3";
import { SQLITE_PATH } from "../config.js";

const db = new sqlite3.Database(SQLITE_PATH, (error) => {
   if (error) {
        console.error(error);
        process.exit(1);
   }

   console.log('Database connected');
});

export const sqliteRun = (sql: string, params?: unknown[]): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, (error: unknown, data: unknown) => {
            if (error) {
                return reject(error);
            }

            resolve(data);
        });
    });
};

export const sqliteGet = (sql: string, params?: unknown[]): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (error: unknown, data: unknown) => {
            if (error) {
                return reject(error);
            }

            resolve(data);
        });
    });
};

export const sqliteAll = (sql: string, params?: unknown[]): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (error: unknown, data: unknown) => {
            if (error) {
                return reject(error);
            }

            resolve(data);
        });
    });
};