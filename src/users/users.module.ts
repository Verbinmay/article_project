import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserDB } from '../db/entities/userDB.entity';
import { UsersRepository } from './users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserDB])],
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
