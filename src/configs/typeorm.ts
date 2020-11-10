import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url:
    process.env.NODE_ENV === 'test'
      ? 'mongodb://1.0.0.3/twenty-minutes-test'
      : 'mongodb://1.0.0.3/twenty-minutes',
  synchronize: true,
  autoLoadEntities: true,
  useUnifiedTopology: true,
};
