import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';

const DATABASE_URL = process.env.DATABASE_URL ?? 'file:./prisma/dev.db';

const sqlFilePath = DATABASE_URL.replace(/^file:/, '');
// Ensure it matches PrismaBetterSqlite3 config signature which takes a config object with url string.
// wait let's just initialize it correctly.
const sqliteConfig = { url: sqlFilePath };
const adapter = new PrismaBetterSqlite3(sqliteConfig);

export const prisma = new PrismaClient({ adapter });
