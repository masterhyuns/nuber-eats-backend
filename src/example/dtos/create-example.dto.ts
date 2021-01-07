// dto -> data transfer object
import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';

@ArgsType() // input 하고자 하는 데이터의 input type
export class CreateExampleDto {
  @Field((type) => String, { nullable: true }) // for graphql return type
  @IsString()
  @Length(5, 10)
  name: string; // for typescript return type

  @Field((type) => Boolean) // for graphql return type
  // for graphql null 허용
  @IsBoolean()
  isVegan?: boolean; // for typescript return type
  // for typescript null 허용

  @Field((type) => String)
  @IsString()
  address: string;

  @Field((type) => String)
  @IsString()
  ownerName: string;
}
