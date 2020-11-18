import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Entity, ObjectIdColumn, PrimaryColumn, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class Email {
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  name: string;
}
