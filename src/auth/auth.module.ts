import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { RepeatingLoginValidationPipe } from '../app/pipes/repeating-login-validation.pipe';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './passport/guards/jwt-auth.guard';
import { LocalAuthGuard } from './passport/guards/local-auth.guard';
import { JwtStrategy } from './passport/strategy/jwt.strategy';
import { LocalStrategy } from './passport/strategy/local.strategy';
import { LoginCase } from './use-cases/login-case';
import { RegistrationCase } from './use-cases/registration-case';

const strategies = [JwtStrategy, LocalStrategy];
const useCases = [RegistrationCase, LoginCase];
const pipes = [RepeatingLoginValidationPipe];
const guards = [JwtAuthGuard, LocalAuthGuard];
@Module({
  imports: [UsersModule, CqrsModule, PassportModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    ...pipes,
    ...useCases,
    ...strategies,
    ...guards,
  ],
})
export class AuthModule {}
