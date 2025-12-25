import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const status = pgEnum('task_status', ['pending', 'in_progress', 'done']);
export const priority = pgEnum('task_priotity', [
  'low',
  'normal',
  'high',
  'urgent',
]);
export type statusPriority = (typeof status.enumValues)[number];
export type taskPriority = (typeof priority.enumValues)[number];

export const Users = pgTable('Users', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  //ispremium: bool().notNull(),
});

export const Workspace = pgTable('Workspace', {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  id_user: uuid()
    .notNull()
    .references(() => Users.id),
});

export const Tasks = pgTable('Tasks', {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text().notNull(),
  priority: priority().notNull().default('normal'),
  status: status().notNull().default('pending'),
  due_date: timestamp('due_date', { mode: 'date' }),
  id_workspace: uuid()
    .notNull()
    .references(() => Workspace.id),
});
