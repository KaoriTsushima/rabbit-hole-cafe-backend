import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function auth(req, res, next) {
    if (!req.cookies.token) {
        return res.sendStatus(401);
    }
    const options = {
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE
    };

    try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET || '', options);
        req.decodedJwt = decoded;
        next();
    } catch (e) {
        return res.sendStatus(401);
    }
}
