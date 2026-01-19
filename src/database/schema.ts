import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  date,
  unique,
} from 'drizzle-orm/pg-core';

export const status = pgEnum('task_status', ['pending', 'in_progress', 'done']);
export const priority = pgEnum('task_priotity', [
  'low',
  'normal',
  'high',
  'urgent',
]);
export const provider = pgEnum('user_provider', ['LOCAL', 'GITHUB', 'GOOGLE']);
export const frequency = pgEnum('habitFreq', ['daily', 'weekly', 'monthly']);
export type taskStatus = (typeof status.enumValues)[number];
export type taskPriority = (typeof priority.enumValues)[number];

export const Users = pgTable('Users', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text(),
  provider: provider().notNull().default('LOCAL'),
  ispremium: boolean().notNull().default(false),
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
    .references(() => Workspace.id, { onDelete: 'cascade' }),
});

export const Habits = pgTable('Habits', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  id_user: uuid()
    .notNull()
    .references(() => Users.id),
  frequency: frequency().notNull().default('daily'),
  created_at: timestamp().defaultNow(),
});

export const Habits_completions = pgTable(
  'Habit_Completions',
  {
    id: uuid().primaryKey().defaultRandom(),
    id_user: uuid()
      .notNull()
      .references(() => Users.id, { onDelete: 'cascade' }),
    completed_at: date().notNull(),
  },
  (table) => ({
    uniqueCompletion: unique().on(table.id, table.completed_at),
  })
);
