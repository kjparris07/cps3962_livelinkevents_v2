import { Pool } from 'pg';

const caCert = process.env.DB_CA ? process.env.DB_CA.replace(/\\n/g, '\n') : undefined;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '18334'),
  ssl: {
    rejectUnauthorized: false,
    ca: caCert
  },
  max: 3,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

export const query = (text: string, params?: any[]) => pool.query(text, params);