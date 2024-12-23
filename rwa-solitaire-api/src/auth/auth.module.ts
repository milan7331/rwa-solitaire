import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from 'src/resoruces/user/user.module';
import { Guard } from './auth.guard';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAuthGuard } from './guards/jwt.guard';
import { HashService } from './hash.service';

@Module({
  imports: [
    // PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        global: true,
        signOptions: {
          expiresIn: '24h',
        },
      })
    }),
    UserModule,
    PassportModule
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    HashService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
  ],
  exports: [
    AuthService,
    JwtModule,
    HashService
  ]
})
export class AuthModule {}
