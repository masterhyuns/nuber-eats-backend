import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class JwtMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    console.log(req);
    next();
  }
}
export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(req);
  next();
}
