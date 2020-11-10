import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EmailsService } from './emails.service';
import { EmailSchema } from './schemas/email.schema';
import { CreateEmailInput } from './dto/create-email.input';
import { UpdateEmailInput } from './dto/update-email.input';

@Resolver(() => EmailSchema )
export class EmailsResolver {
  constructor(private readonly emailsService: EmailsService) {}

  @Mutation(() => EmailSchema)
  async createEmail(
    @Args('createEmailInput') createEmailInput: CreateEmailInput,
  ): Promise<EmailSchema> {
    return await this.emailsService.create(createEmailInput);
  }

  @Query(() => [EmailSchema], { name: 'emails' })
  async findAll(): Promise<EmailSchema[]> {
    return await this.emailsService.findAll();
  }

  @Query(() => EmailSchema, { name: 'email' })
  async findOne(
    @Args('email', { type: () => String }) email: string,
  ): Promise<EmailSchema> {
    return await this.emailsService.findOne(email);
  }

  @Mutation(() => EmailSchema)
  async updateEmail(
    @Args('updateEmailInput') updateEmailInput: UpdateEmailInput,
  ): Promise<EmailSchema> {
    return await this.emailsService.update(updateEmailInput);
  }

  @Mutation(() => EmailSchema)
  async removeEmail(
    @Args('email', { type: () => String }) email: string,
  ): Promise<EmailSchema> {
    return await this.emailsService.remove(email);
  }
}
