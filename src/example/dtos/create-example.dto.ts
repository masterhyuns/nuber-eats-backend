// dto -> data transfer object
import { ArgsType, Field, InputType, OmitType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
import { Example } from '../entities/example.entity';

// before mapped type
/*@ArgsType() // input 하고자 하는 데이터의 input type
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
}*/

@InputType() // MappedType을 사용하면 InputType 을 선언해야함
export class CreateExampleDto extends OmitType(Example, ['id']) {} // 부모의 Type 이 자신과 다를 떄 두번째 인자로 원하는 Type 을 명시하거나 부모 class 에서 InputType 을 abstract 해준다.
