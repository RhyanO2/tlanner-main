import jwt from 'jsonwebtoken';
export async function checkRequestJWT(req, res) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send();
    }
    if (!process.env.JWT_SECRET) {
        throw new Error(`JWT_SECRET MUST BE SET.`);
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log(payload);
    }
    catch (err) {
        return res.status(401).send();
    }
}
