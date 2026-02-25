import { faker as f } from '@faker-js/faker';

import { db } from '../../database/index.js';
import { Habits } from '../../database/schema.js';
import { makeUser } from './makeUser.js';

export async function makeHabit(userID?: string) {
  const { user } = await makeUser();

  const Habit = await db
    .insert(Habits)
    .values({
      name: f.lorem.words(2),
      frequency: 'daily',
      id_user: userID || user.id,
    })
    .returning();

  return Habit[0];
}
