// src/tests/helpers/db.helper.ts
import { db } from '../../database/index.js';
import { Habits, Tasks, Users, Workspace } from '../../database/schema.js';

export async function cleanTestDatabase() {
  db.delete(Tasks);
  db.delete(Habits);
  db.delete(Workspace);
  db.delete(Users);
}
