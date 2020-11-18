import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class EmailSchema {
  @Field(() => String, { description: 'E-mail' })
  email: string;

  @Field(() => String, { description: 'Nome' })
  name: string;
}
