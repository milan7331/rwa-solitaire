import { Injectable, ExecutionContext, UnauthorizedException, CanActivate } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "./auth.decorators";

// NE KORISTI SE

@Injectable()
export class Guard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const authSkip = this.checkForAuthSkip(context);
        if (authSkip) return true;

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException();
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET')
            });
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }

    private checkForAuthSkip(context: ExecutionContext): boolean {
        const authSkip = this.reflector.getAllAndOverride(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()]
        );
        if (authSkip) return true;
        return false;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}