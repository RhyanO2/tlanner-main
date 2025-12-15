import {date,pgEnum,pgTable,text,timestamp,uuid,} from 'drizzle-orm/pg-core';

export const status = pgEnum('task_status', ['pending', 'in_progress', 'done']);

export const Users = pgTable('Users', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
});

export const Tasks = pgTable('Tasks', {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text().notNull(),
  status: status().notNull().default('pending'),
  due_date: timestamp('due_date', { mode: 'date' }),
  id_user: uuid()
    .notNull()
    .references(() => Users.id),
});
