import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { APP_SETTINGS } from '../app/settings/app-settings';
import { UserDB } from './entities/userDB.entity';

const entities = [UserDB];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get(APP_SETTINGS.ARTICLE_DB_HOST),
        port: +configService.get<number>(APP_SETTINGS.ARTICLE_DB_PORT)!,
        username: configService.get(APP_SETTINGS.ARTICLE_DB_USER),
        password: configService.get(APP_SETTINGS.ARTICLE_DB_PASSWORD) as string,
        database: configService.get(APP_SETTINGS.ARTICLE_DB_NAME),
        entities: [...entities],
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class DbModule {}
