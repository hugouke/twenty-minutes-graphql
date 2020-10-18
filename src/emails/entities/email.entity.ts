import { ObjectType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Entity, ObjectIdColumn, PrimaryColumn, Unique } from 'typeorm';

@Entity()
@ObjectType()
@Unique(['email'])
export class Email {
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  @Field(() => String, { description: 'E-mail' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column()
  @Field(() => String, { description: 'Nome' })
  @IsNotEmpty()
  name: string;
}
