import Redis from 'ioredis';

import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisDBService {
  private readonly redis: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow();
  }

  async set(key: string, value: string, time: number) {
    try {
      return await this.redis.set(key, value, 'EX', time);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async get(key: string) {
    try {
      return await this.redis.get(key);
    } catch (error) {
      console.error(error);
      //! Обработка ошибок
      return null;
    }
  }

  async del(key: string) {
    try {
      return await this.redis.del(key);
    } catch (error) {
      console.error(error);
      //! Обработка ошибок
      return null;
    }
  }

  async deleteKeysByPattern(pattern: string): Promise<number | null> {
    try {
      let deletedCount = 0;
      const stream = this.redis.scanStream({
        match: pattern,
        count: 100,
        type: 'STRING',
      });

      for await (const keys of stream as AsyncIterable<string[]>) {
        if (!keys?.length) continue;

        try {
          const pipeline = this.redis.pipeline();
          keys.forEach((key) => pipeline.unlink(key));

          const results = await Promise.race([
            pipeline.exec(),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error('Pipeline timeout exceeded')),
                5000, // Таймаут 5 секунд
              ),
            ),
          ]);

          deletedCount += (results as [Error, any][]).filter(
            ([err]) => !err,
          ).length;
        } catch (pipeError) {
          console.error('Error processing batch:', pipeError);
        }
      }

      return deletedCount;
    } catch (error) {
      console.error(error);
      //! Обработка ошибок
      return null;
    }
  }
}
