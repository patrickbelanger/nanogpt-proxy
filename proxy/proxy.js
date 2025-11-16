#!/usr/bin/env node

import express from 'express';
import helmet from 'helmet';
import axios from 'axios';

import { Environment } from './environment.js';
import { Cryptor } from './cryptor.js';

const app = express();

const db = new DatabaseHandler().db;

const API_BASE = 'https://nano-gpt.com/api';
const SUBSCRIPTION_API_BASE = API_BASE + '/subscription/v1';
const REGULAR_API_BASE = API_BASE + '/v1';

const env = new Environment();
const cryptor = new Cryptor(env.dbEncryptionKey);

app.use(helmet());
app.use(express.json({ limit: '5mb' }));

app.all('/v1/*', async (req, res) => {
    const userEmail = req.headers['x-openwebui-user-email'];

    console.log(`[${req.method}] ${req.path} for ${userEmail || 'unknown user'}`);

    if (req.path === '/v1/models') {
        console.log('[PASS] /v1/models');

        try {
            const response = await axios.get(`${SUBSCRIPTION_API_BASE}/models`, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 60000,
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

    if (!userEmail) {
        return res.status(400).json({ error: 'Missing user email header' });
    }

    const row = db.prepare('SELECT api_key FROM users WHERE email = ?').get(userEmail);
    
    if (!row) {
        return res.status(401).json({ error: 'User not found in DB' });
    }

    const userKey = cryptor.decrypt(row.api_key);

    const upstream = await axios({
        url: `${REGULAR_API_BASE}${req.path}`,
        method: req.method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userKey}`,
        },
        data: req.method !== 'GET' ? req.body : undefined,
        responseType: 'stream',
        timeout: 180000,
    });

    res.setHeader('Content-Type', upstream.headers['content-type'] || 'application/json');
    upstream.data.pipe(res);
});

app.listen(3000, () => console.log('✅ Proxy ready at http://localhost:3000'));
