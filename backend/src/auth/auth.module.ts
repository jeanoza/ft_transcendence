import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { LocalStrategy } from './local.strategy';
import { LocalSerializer } from './local-serializer';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    //PassportModule.register({ session: true }),
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      //FIXME: here to change by env variable
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, LocalSerializer, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
