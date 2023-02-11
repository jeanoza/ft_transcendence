import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

//export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
//  canActivate(context: ExecutionContext): boolean {
//    const request = context.switchToHttp().getRequest();
//    const exclude = ['/'];

//    return !exclude.includes(request.url);
//  }
//}
