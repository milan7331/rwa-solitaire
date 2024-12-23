import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/resoruces/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from './hash.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private hashService: HashService
    ) {}

    async validateUser(username: string, plainPassword: string): Promise<any> {
        const user = await this.userService.findOne(username);
        if (!user) return null;

        if (this.hashService.verifyPassword(user.passwordHash, plainPassword)) {
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
}
