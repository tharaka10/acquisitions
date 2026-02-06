import 'dotenv/config';

import { neon } from '@neondatabase/serverless';
import {drizzle} from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL); // Automatically uses the DATABASE_URL from environment variables

const db = drizzle(sql);

export { db, sql };