import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from '$env/static/private';
import type { User } from '@prisma/client';

export function createJWT(user: User) {
    return  jwt.sign({id: user.id, username: user.username}, JWT_ACCESS_SECRET, {
      expiresIn: '1d'
    });
  }

export function verifyJWT(token: string) {
    return jwt.verify(token, JWT_ACCESS_SECRET);
}

export function getUserId(token: string) {
    return jwt.decode(token).id;
}