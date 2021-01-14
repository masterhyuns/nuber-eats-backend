import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from './jwt.service';
import { UsersService } from '../users/users.service';

@Injectable() // dependency 주입을 위해 선언
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const id = decoded['id'];

          const user = await this.usersService.findById(id);
          req['user'] = user;
        }
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
    next();
  }
}
/*
export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(req);
  next();
}
*/
