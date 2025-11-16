import sqlite from 'better-sqlite3';

const DB_PATH = './keys.db';

export class DatabaseHandler {
    #db;

    constructor() {
        this.#db = sqlite(DB_PATH);

        this.#db.exec(`
CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    api_key TEXT NOT NULL
);
        `);
    }

    get db() {
        return this.#db;
    }
}