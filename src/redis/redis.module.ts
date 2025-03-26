import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { APP_SETTINGS } from '../app/settings/app-settings';
import { RedisDBService } from './redis.service';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): RedisModuleOptions => {
        return {
          config: {
            host: configService.get(APP_SETTINGS.ARTICLE_REDIS_HOST),
            port: +configService.get<number>(APP_SETTINGS.ARTICLE_REDIS_PORT)!,
            password: configService.get(APP_SETTINGS.ARTICLE_REDIS_PASSWORD),
            name: configService.get(APP_SETTINGS.ARTICLE_REDIS_NAME),
            username: configService.get(APP_SETTINGS.ARTICLE_REDIS_USER),
          },
        };
      },
    }),
  ],
  providers: [RedisDBService],
  exports: [RedisDBService],
})
export class RedisDBModule {}
