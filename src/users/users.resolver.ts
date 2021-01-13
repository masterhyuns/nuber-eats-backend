import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { CoreOutput } from '../common/entities/core.output';
import { CommonUtils } from '../common/common.utils';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation((returns) => CreateUserOutput)
  createAccount(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.usersService.createAccount(createUserInput);
  }

  @Mutation((returns) => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Query((returns) => CoreOutput)
  @UseGuards(AuthGuard)
  async me(@Context() context): Promise<CoreOutput> {
    if (context.user) {
      return {
        ok: true,
      };
    } else {
      return CommonUtils.output('User not found');
    }
  }
}
