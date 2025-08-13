import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: (req: Request) => {
                return req.cookies['token'];
            },
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('NEST_JWT_SECRET')
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