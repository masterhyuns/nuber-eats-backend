import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsBoolean, IsString, Length } from 'class-validator';

@InputType({ isAbstract: true }) // 두개로 만들어도 되지만 사용하지 않으므로 확장만 해준다.
@ObjectType() // for graphql
@Entity() // for typeorm
export class Example {
  @PrimaryGeneratedColumn() // for typeorm
  @Field((type) => Number) // for graphql
  id: number;

  @Field((type) => String) // for graphql
  @Column() // for typeorm
  @IsString()
  @Length(5, 10) // mapped type 을 위해 해당 클래스에서 유효성 체크
  name: string; // for typescript return type

  @Field((type) => Boolean, { nullable: true }) // for graphql
  @Column({ nullable: true }) // for typeorm
  @IsBoolean() // mapped type 을 위해 해당 클래스에서 유효성 체크
  // for graphql null 허용
  isVegan?: boolean; // for typescript return type
  // for typescript null 허용

  @Field((type) => String) // for graphql
  @Column() // for typeorm
  @IsString() // mapped type 을 위해 해당 클래스에서 유효성 체크
  address: string;

  @Field((type) => String, { defaultValue: '강남' }) // for graphql
  @Column() // for typeorm
  @IsString() // mapped type 을 위해 해당 클래스에서 유효성 체크
  ownerName: string;

  @Field((type) => String)
  @Column() // for typeorm
  @IsString() // mapped type 을 위해 해당 클래스에서 유효성 체크
  categoryName: string;
}
