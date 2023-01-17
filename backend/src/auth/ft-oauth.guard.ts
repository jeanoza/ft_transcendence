import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FTOauthGuard extends AuthGuard('ft_oauth') {}
