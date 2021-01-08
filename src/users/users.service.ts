import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { CommonUtils } from '../common/common.utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      const exits = await this.repository.findOne({ email });
      if (exits) {
        return CommonUtils.output('There is a user with that email already');
      }
      await this.repository.save(
        this.repository.create({
          email,
          password,
          role,
        }),
      );
      return CommonUtils.output();
    } catch (e) {
      return CommonUtils.output("Couldn't create account");
    }
  }
}
