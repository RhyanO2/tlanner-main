import { userLogin, userRegister } from '../services/userService.js';
export async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        const user = await userRegister(name, email, password);
        res.status(201).send({ User: `${user.id} Created with sucess!` });
    }
    catch (err) {
        res.status(err.statuscode || 400).send({
            message: err.message,
        });
    }
}
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        const result = await userLogin(email, password);
        res.status(200).send({
            message: 'Acess granted!',
            token: result,
        });
    }
    catch (err) {
        res.status(err.statuscode || 400).send({
            message: err.message,
        });
    }
}
