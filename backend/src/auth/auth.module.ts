import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { LocalSerializer } from './strategy/local-serializer';
import { Auth42Strategy } from './strategy/auth42.strategy';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { Auth2faService } from './auth-2fa.service';
import { Auth2faController } from './auth-2fa.controller';

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
    LocalStrategy,
    LocalSerializer,
    Auth42Strategy,
    Auth2faService,
  ],
  controllers: [AuthController, Auth2faController],
  exports: [AuthService],
})
export class AuthModule {}
