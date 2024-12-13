import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/resoruces/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(username: string, passwordHash: string): Promise<any> {
        const user = await this.userService.findOne(username);
        if (user && user.passwordHash === passwordHash) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any): Promise<{ access_token: string }> {
        const payload = {
            sub: user.userId,
            username: user.username,
            iat: Math.floor(Date.now() / 1000),
            eat: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
        };

        return { access_token: await this.jwtService.signAsync(payload) };
    }


    // async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    //     const user = await this.userService.findOne(username);
    //     if (user?.password !== pass) throw new UnauthorizedException();
    //     const payload = {
    //         sub: user.userId,
    //         username: user.username,
    //         iat: Math.floor(Date.now() / 1000),
    //         eat: Math.floor(Date.now() / 1000) + (2 * 24 * 60 * 60)
    //     };
    //     return {
    //         access_token: await this.jwtService.signAsync(payload)
    //     }
    // }
}
