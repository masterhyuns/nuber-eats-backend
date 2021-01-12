import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { CommonUtils } from '../common/common.utils';
import { LoginInput, LoginOutput } from './dtos/login.dto';

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

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    /*
      - step1 : find the user with the email
      - step2 : check if the password is correct
        - bcrypt.compare(data, encrypted)
      - step3 : make a JWT and give it to the user
    */
    try {
      const user = await this.repository.findOne({ email });
      if (!user) {
        return CommonUtils.output('User not found');
      }
      const correctPassword = await user.checkPassword(password);
      if (!correctPassword) {
        return CommonUtils.output('Password not correct');
      }
      return {
        ok: true,
        token: 'lalalala',
      };
    } catch (e) {
      return CommonUtils.output("Couldn't login");
    }
  }
}
