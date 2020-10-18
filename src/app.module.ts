import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsModule } from './emails/emails.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://1.0.0.3/twenty-minutes',
      synchronize: true,
      autoLoadEntities: true,
      useUnifiedTopology: true,
    }),
    EmailsModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
  ],
})
export class AppModule {}
