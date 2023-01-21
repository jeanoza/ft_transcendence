import { Strategy } from 'passport-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class Auth42Strategy extends PassportStrategy(Strategy, 'auth42') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.AUTH42_ID,
      clientSecret: process.env.AUTH42_SECRET,
      authorizationURL: process.env.AUTH42_AUTH_URL,
      callbackURL: process.env.AUTH42_CB_URL,
      tokenURL: process.env.AUTH42_TOKEN_URL,
    });
  }

  async validate(accessToken: string) {
    try {
      const res = await fetch('https://api.intra.42.fr/v2/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { login, image, email, displayname: name } = await res.json();

      let userId = await this.authService.validateUser(email);

      if (!userId) {
        const imageURL = image.versions.small;
        const data = {
          name,
          login,
          email,
          imageURL,
        };
        userId = await this.authService.addUser42(data);
      }
      this.authService.login({ id: userId, name, email });
      return true;
    } catch (e) {
      throw e;
    }
  }
}
