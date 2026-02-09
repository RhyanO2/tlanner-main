import {
  habitsCreate,
  habitEdit,
  habitRemove,
  habitsGet,
} from '../services/habitService';
import { type FastifyRequest, type FastifyReply } from 'fastify';

export async function getHabitsByUserID(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    const { userID } = req.params as { userID: string };
    const result = await habitsGet(userID);
    res.status(200).send({
      user: userID,
      habits: result,
    });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function postHabit(req: FastifyRequest, res: FastifyReply) {
  // const { userid } = req.params as {
  //   userid: string;
  // };
  const { name, frequency, id_user } = req.body as {
    name: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    id_user: string;
  };
  try {
    const habit = await habitsCreate(name, frequency, id_user);
    res.status(201).send({ habits: [habit] });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function editHabit(req: FastifyRequest, res: FastifyReply) {
  const { id } = req.params as { id: string };
  const { name, frequency } = req.body as {
    name: string;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
  try {
    await habitEdit(name, frequency, id);
    res.status(200).send({ message: 'Habit edited!' });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function delHabit(req: FastifyRequest, res: FastifyReply) {
  try {
    const { id } = req.params as { id: string };

    await habitRemove(id);

    res.status(200).send({ message: 'Habit deleted!' });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}
