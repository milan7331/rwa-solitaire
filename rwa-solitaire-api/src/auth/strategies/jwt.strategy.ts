import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET')
        });
    }

    async validate(payload: any) {
        // ovde dodati biznis logiku, možda više info o useru,
        // ovde takođe ide provera za revoked tokene itd. . .

        return {
            userId: payload.sub,
            username: payload.username
        }
    }

}