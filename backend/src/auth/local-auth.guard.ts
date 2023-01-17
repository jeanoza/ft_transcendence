import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//export class LocalAuthGuard extends AuthGuard('local') {
//  async canActivate(context: ExecutionContext): Promise<boolean> {
//    if (await super.canActivate(context)) {
//      const req = context.switchToHttp().getRequest();
//      //await super.logIn(req);//FIXME: see after .logIn is a function for session but i will not use session
//    }
//    return true;
//  }
//}
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
