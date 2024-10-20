import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy , VerifyCallback } from "passport-facebook";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook'){
    constructor(
        private readonly configService: ConfigService
    ){
        super({
            clientID: configService.get<string>('facebook.clientID'),
            clientSecret: configService.get<string>('facebook.clientSecret'),
            callbackURL: configService.get<string>('facebook.callbackURL'),
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>{
        const { displayName, id, gender }=  profile;
        const user = {
            fullName: displayName,
            LoginAppId: id,
            gender: gender
        }

        done(null, user);
    }
}