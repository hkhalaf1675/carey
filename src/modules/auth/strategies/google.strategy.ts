import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google'){
    constructor(
        private readonly configService: ConfigService
    ){
        super({
            clientID: configService.get<string>('google.clientID'),
            clientSecret: configService.get<string>('google.clientSecret'),
            callbackURL: configService.get<string>('google.callbackURL'),
            scope: ['email', 'profile']
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>{
        const { displayName, emails, id, photos } = profile;
        const user = {
            email: (emails[0].email) ? emails[0].email : emails[0].value,
            emailVerified: emails[0].verified,
            fullName: displayName,
            picture: photos[0].value,
            LoginAppId: id
        };

        done(null, user);
    }
}