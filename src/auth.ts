import { NextFunction, Request, Response } from "express";
import {JwtPayload, sign, verify, VerifyErrors} from 'jsonwebtoken';
import { loginUser as serviceLoginUser, getById } from "./resources/users/user.service";
import { JWT_SECRET_KEY } from "./common/config";


export const checkAuthenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    res.status(401).json({error: 'Unauthorized'});
    return;
  }

  const chunks = authHeader.split(' ');
  if (chunks.length !== 2 || chunks[0] !== 'Bearer') {
    res.status(401).json({error: 'Unauthorized'});
    return;
  }
  const jwt = chunks[1];
  verify(jwt, JWT_SECRET_KEY, {algorithms: ['HS256']}, async (err: VerifyErrors|null, decoded: JwtPayload|string|undefined) => {
    if (err || !decoded) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }
    const { userId, login } = decoded as JwtPayload;
    const user = await getById(userId);
    if (!user || user.login !== login) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }

    res.locals.user = user; // store user for later use
    next();
  });
}

export const loginUser = async (login: string, password: string): Promise<string|null> => {
  const user = await serviceLoginUser(login, password);
  if (!user) {
    return null;
  }

  return sign({userId: user.id, login: user.login}, JWT_SECRET_KEY, {expiresIn: '30d'});
}
