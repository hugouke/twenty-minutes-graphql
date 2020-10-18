import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateEmailInput {
  @Field(() => String, { description: 'E-mail' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'Nome' })
  @IsNotEmpty()
  name: string;
}
