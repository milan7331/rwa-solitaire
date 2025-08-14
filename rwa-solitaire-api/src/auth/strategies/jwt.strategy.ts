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

    // Nest dokumentacija:

    // The validate() method deserves some discussion. For the jwt-strategy,
    // Passport first verifies the JWT's signature and decodes the JSON. It
    // then invokes our validate() method passing the decoded JSON as its
    // single parameter. Based on the way JWT signing works, we're guaranteed
    // that we're receiving a valid token that we have previously signed and
    // issued to a valid user.

    // As a result of all this, our response to the validate() callback is trivial:
    // we simply return an object containing the userId and username properties.
    // Recall again that Passport will build a user object based on the return value
    // of our validate() method, and attach it as a property on the Request object.

    // Additionally, you can return an array, where the first value is used to create
    // a user object and the second value is used to create an authInfo object.

    async validate(payload: any) {
        // ovde potencijalno dodati biznis logiku, možda više info o useru...

        return {
            userId: payload.sub,
            username: payload.username
        }
    }
}