import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Example {
  @Field((type) => String) // for graphql return type
  name: string; // for typescript return type

  @Field((type) => Boolean, { nullable: true }) // for graphql return type
  // for graphql null 허용
  isGood?: string; // for typescript return type
  // for typescript null 허용
}
