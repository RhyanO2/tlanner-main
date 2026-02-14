import { deleteCache, getCache, setCache } from '../cache/cacheUtils';
import { AppError } from '../errors/AppError';
import {
  getHabitsByID,
  getHabitsByUserID,
  HabitInsert,
  HabitUpdate,
  HabitDelete,
} from '../models/habitModel';

export async function habitsGet(userID: string) {
  const cacheKey = `habits:user:${userID}`;

  const cached = await getCache<typeof habits>(cacheKey);

  if (cached) return cached;

  const habits = await getHabitsByUserID(userID);

  if (habits.length === 0) {
    throw new AppError(`user: ${userID} don't have any habits`, 404);
  }

  await setCache(cacheKey, habits, 500);
  return habits;
}
export async function habitsCreate(
  name: string,
  frequency: 'daily' | 'weekly' | 'monthly',
  userID: string
) {
  const createHabit = await HabitInsert(name, frequency, userID);

  await deleteCache(`habits:user:${userID}`);

  return createHabit;
}

export async function habitEdit(
  name: string,
  frequency: 'daily' | 'weekly' | 'monthly',
  habitID: string
) {
  const habit = await getHabitsByID(habitID);

  if (habit.length === 0) {
    throw new AppError('task cannot be find', 404);
  }

  const editedHabit = await HabitUpdate(name, frequency, habitID);

  await deleteCache(`habits:user:${habit[0].id_user}`);

  return editedHabit;
}

export async function habitRemove(habitID: string) {
  const habit = await getHabitsByID(habitID);

  if (habit.length === 0) {
    throw new AppError('task cannot be find', 404);
  }
  const deletedHabit = await HabitDelete(habitID);

  await deleteCache(`habits:user:${habit[0].id_user}`);

  return deletedHabit;
}
