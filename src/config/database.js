import 'dotenv/config';

import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;

let db;
let sql;

if (process.env.NODE_ENV === 'development') {
  // Use standard PostgreSQL driver for local development
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  db = drizzlePg(pool);
  sql = pool;
} else {
  // Use Neon serverless for production
  sql = neon(process.env.DATABASE_URL);
  db = drizzleNeon(sql);
}

export { db, sql };
