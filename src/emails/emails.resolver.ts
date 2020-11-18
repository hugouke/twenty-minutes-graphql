import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EmailsService } from './emails.service';
import { Email } from './entities/email.entity';
import { CreateEmailInput } from './dto/create-email.input';
import { UpdateEmailInput } from './dto/update-email.input';
import { EmailSchema } from './schemas/email.schema';

/* istanbul ignore next */
const schema = () => EmailSchema;
/* istanbul ignore next */
const emailsSchema = () => [EmailSchema];

@Resolver(() => Email)
export class EmailsResolver {
  constructor(private readonly emailsService: EmailsService) {}

  @Mutation(schema)
  async createEmail(
    @Args('createEmailInput') createEmailInput: CreateEmailInput,
  ): Promise<Email> {
    return await this.emailsService.create(createEmailInput);
  }

  @Query(emailsSchema, { name: 'emails' })
  async findAll(): Promise<Email[]> {
    return await this.emailsService.findAll();
  }

  @Query(schema, { name: 'email' })
  async findOne(@Args('email') email: string): Promise<Email> {
    return await this.emailsService.findOne(email);
  }

  @Mutation(schema)
  async updateEmail(
    @Args('updateEmailInput') updateEmailInput: UpdateEmailInput,
  ): Promise<Email> {
    return await this.emailsService.update(updateEmailInput);
  }

  @Mutation(schema)
  async removeEmail(@Args('email') email: string): Promise<Email> {
    return await this.emailsService.remove(email);
  }
}
