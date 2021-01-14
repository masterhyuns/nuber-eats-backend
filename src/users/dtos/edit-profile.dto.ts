import { CoreOutput } from '../../common/entities/core.output';
import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['email', 'password', 'role']),
) {}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
