import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { LocalSerializer } from './strategy/local-serializer';
import { Auth42Strategy } from './strategy/auth42.strategy';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './controllers/auth.controller';
import { _2faService } from './services/_2fa.service';
import { _2faController } from './controllers/_2fa.controller';
import { Jwt2faStrategy } from './strategy/jwt-2fa.strategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${process.env.JWT_MAX_AGE}s` },
    }),
    UserModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    Jwt2faStrategy,
    LocalStrategy,
    LocalSerializer,
    Auth42Strategy,
    _2faService,
  ],
  controllers: [AuthController, _2faController],
  exports: [AuthService],
})
export class AuthModule {}
