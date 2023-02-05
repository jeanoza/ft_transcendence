import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class Jwt2faGuard extends AuthGuard('jwt-2fa') {
  //canActivate(context: ExecutionContext) {
  //  // Add your custom authentication logic here
  //  // for example, call super.logIn(request) to establish a session.
  //  return super.canActivate(context);
  //}
  //// eslint-disable-next-line @typescript-eslint/no-unused-vars
  //handleRequest(err, user, info) {
  //  // You can throw an exception based on either "info" or "err" arguments
  //  if (err || !user) {
  //    throw err || new UnauthorizedException('2fa');
  //  }
  //  return user;
  //}
}
