import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: 'mongodb://1.0.0.3/twenty-minutes',
  synchronize: true,
  autoLoadEntities: true,
  useUnifiedTopology: true,
};
