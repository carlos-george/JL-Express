import dotenv from 'dotenv';
dotenv.config();
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppErrors } from '../errors/AppErrors';


export interface UserReq {
    id: string,
    iat: number,
    exp: number
}

const auth = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) throw new AppErrors('No token provided', 401); //return res.status(401).send({ error: 'No token provided' });

    const parts = authHeader.split(' ');

    if (parts.length !== 2) throw new AppErrors('Token error', 401); //return res.status(401).send({ error: 'Token error' });

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) throw new AppErrors('Token malformatted', 401); //return res.status(401).send({ error: 'Token malformatted' });

    try {
        jwt.verify(token, process.env.JWT_KEY!, (err, decoded) => {
            if (err) {
                console.log('Passou por aqui 3: ', err);
                throw new AppErrors('Token has expired');
                //return res.status(401).send({ error: 'Token has expired!' })
            }

            req.user = decoded as UserReq;
        });
        return next();
    } catch (error) {
        throw new AppErrors(error.message, 401);
        // return res.status(401).json({ error: 'Falha na autenticação do usuário.' });
    }
}

export default auth;