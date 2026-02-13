// src/tests/helpers/db.helper.ts
import { db } from '../../database/index.js';
import { sql } from 'drizzle-orm';
import { Habits, Tasks, Users, Workspace } from '../../database/schema.js';

export async function cleanTestDatabase() {
  await db.delete(Tasks);
  await db.delete(Habits);
  await db.delete(Workspace);
  await db.delete(Users);
}

cleanTestDatabase();
