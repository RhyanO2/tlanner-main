import { eq } from 'drizzle-orm';
import { db } from '../database/index';
import { Habits } from '../database/schema';

export async function getHabitsByUserID(userID: string) {
  return await db.select().from(Habits).where(eq(Habits.id_user, userID));
}
export async function getHabitsByID(habitID: string) {
  return await db.select().from(Habits).where(eq(Habits.id, habitID));
}
export async function HabitInsert(
  name: string,
  frequency: 'daily' | 'weekly' | 'monthly',
  userID: string
) {
  const createdHabit = await db
    .insert(Habits)
    .values([{ name: name, frequency: frequency, id_user: userID }])
    .returning();

  return createdHabit[0];
}
export async function HabitUpdate(
  name: string,
  frequency: 'daily' | 'weekly' | 'monthly',
  habitID: string
) {
  const updatedHabit = await db
    .update(Habits)
    .set({ name: name, frequency: frequency })
    .where(eq(Habits.id, habitID))
    .returning();

  return updatedHabit[0];
}
export async function HabitDelete(habitID: string) {
  const deletedHabit = await db
    .delete(Habits)
    .where(eq(Habits.id, habitID))
    .returning();

  return deletedHabit[0];
}
