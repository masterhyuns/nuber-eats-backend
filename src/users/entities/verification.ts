import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { User } from './user.entity';
import { JoinColumn } from 'typeorm/browser';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field((type) => String)
  code: string;

  @OneToOne((type) => User)
  @JoinColumn()
  user: User;
}
