// src/tests/helpers/db.helper.ts
import { db } from '../../database/index.js';
import { sql } from 'drizzle-orm';
export async function cleanTestDatabase() {
  await db.execute(sql`
    TRUNCATE TABLE "Tasks", "Habits", "Workspace", "Users" 
    RESTART IDENTITY CASCADE
  `);
}
