import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType() // for graphql
@Entity() // for typeorm
export class Example {
  @PrimaryGeneratedColumn() // for typeorm
  @Field((type) => Number) // for graphql
  id: number;

  @Field((type) => String) // for graphql
  @Column() // for typeorm
  name: string; // for typescript return type

  @Field((type) => Boolean, { nullable: true }) // for graphql
  @Column() // for typeorm
  // for graphql null 허용
  isVegan?: boolean; // for typescript return type
  // for typescript null 허용

  @Field((type) => String) // for graphql
  @Column() // for typeorm
  address: string;

  @Field((type) => String) // for graphql
  @Column() // for typeorm
  ownerName: string;

  @Field((type) => String)
  @Column() // for typeorm
  categoryName: string;
}
