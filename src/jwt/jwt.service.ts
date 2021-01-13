import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './intefaces/jwt-module-options.interface';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}

  sign(id: number): string {
    return jwt.sign({ id }, this.options.privateKey, {
      algorithm: 'HS256',
    });
  }

  verify(token: string) {
    return jwt.verify(token, this.options.privateKey, {
      algorithms: ['HS256'],
    });
  }
}
