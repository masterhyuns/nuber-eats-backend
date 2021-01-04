// dto -> data transfer object
import { ArgsType, Field, InputType } from '@nestjs/graphql';

@ArgsType() // input 하고자 하는 데이터의 input type
export class CreateExampleDto {
  @Field((type) => String) // for graphql return type
  name: string; // for typescript return type

  @Field((type) => Boolean) // for graphql return type
  // for graphql null 허용
  isVegan?: string; // for typescript return type
  // for typescript null 허용

  @Field((type) => String)
  address: string;

  @Field((type) => String)
  ownerName: string;
}
