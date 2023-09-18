import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function generateJWT(username) {
    const options = {
        issuer: process.env.JWT_ISSUER,
        subject: username,
        audience: process.env.JWT_AUDIENCE,
        expiresIn: "1h"
    };

    return jwt.sign({ username }, process.env.JWT_SECRET || '', options);
}
