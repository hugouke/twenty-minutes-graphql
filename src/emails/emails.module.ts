import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsResolver } from './emails.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from './entities/email.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Email])],
  providers: [EmailsResolver, EmailsService],
})
export class EmailsModule {}
