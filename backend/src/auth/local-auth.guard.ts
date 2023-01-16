import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (await super.canActivate(context)) {
      const req = context.switchToHttp().getRequest();
      await super.logIn(req);
    }
    return true;
  }
}
