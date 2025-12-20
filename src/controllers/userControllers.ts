import { userLogin, userRegister } from '../services/userService.ts';
import { type FastifyRequest, type FastifyReply } from 'fastify';

// const {FastifyRequest,FastifyReply} = pkg

export async function register(req: FastifyRequest, res: FastifyReply) {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };
    const user = await userRegister(name, email, password);

    res.status(201).send({ User: `${user.id} Created with sucess!` });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function login(req: FastifyRequest, res: FastifyReply) {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };
    const result = await userLogin(email, password);

    res.status(200).send({
      message: 'Acess granted!',
      token: result,
    });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}
