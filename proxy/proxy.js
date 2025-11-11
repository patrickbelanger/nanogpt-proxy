import express from 'express';
import helmet from 'helmet';
import sqlite from 'better-sqlite3';
import axios from 'axios';
import { decrypt } from "./utilities/crypto.js";

const app = express();
const DB_PATH = './keys.db';
const db = sqlite(DB_PATH);
const API_BASE = 'https://nano-gpt.com/api/v1';

app.use(helmet());
app.use(express.json({ limit: '5mb' }));

app.all('/v1/*', async (req, res) => {
    const userEmail = req.headers['x-openwebui-user-email'];

    console.log(`[${req.method}] ${req.path} for ${userEmail || 'unknown user'}`);

    if (req.path === '/v1/models') {
        console.log('[PASS] /v1/models');

        try {
            const response = await axios.get(`${API_BASE}/models`, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000,
            });
            return res.json(response.data);
        } catch (err) {
            console.error(
                '[ERROR] /v1/models failed:',
                err.response?.status,
                err.response?.data || err.toString()
            );
            return res.status(500).json({
                error: err.response?.data || err.toString(),
            });
        }
    }

    if (!userEmail) return res.status(400).json({ error: 'Missing user email header' });

    const row = db.prepare('SELECT api_key FROM users WHERE email = ?').get(userEmail);
    if (!row) return res.status(401).json({ error: 'User not found in DB' });

    const userKey = decrypt(row.api_key);

    const upstream = await axios({
        url: `${API_BASE}${req.path}`,
        method: req.method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userKey}`,
        },
        data: req.method !== 'GET' ? req.body : undefined,
        responseType: 'stream',
        timeout: 120000,
    });

    // Stream the response through
    res.setHeader('Content-Type', upstream.headers['content-type'] || 'application/json');
    upstream.data.pipe(res);
});

app.listen(3000, () => console.log('✅ Proxy ready at http://localhost:3000'));
