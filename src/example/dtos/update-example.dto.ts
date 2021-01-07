import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateExampleDto } from './create-example.dto';
import { IsNumber } from 'class-validator';

@InputType()
export class UpdateExampleInput extends PartialType(CreateExampleDto) {}

@InputType()
export class UpdateExampleDto {
  @Field((type) => Number) // for graphql
  @IsNumber()
  id: number;

  @Field((type) => UpdateExampleInput)
  data: UpdateExampleInput;
}
