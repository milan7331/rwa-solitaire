import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/resources/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from './hash.service';
import { DeepPartial } from 'typeorm';
import { User } from 'src/resources/user/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly hashService: HashService
    ) {}

    // find one also checks for password matching, no need to call the hashService derictly
    async validateUser(username: string, plainPassword: string): Promise<DeepPartial<User> | null> {
        const user = await this.userService.findOne(username, null, plainPassword, false, false);
        if (!user) return null;
        const { passwordHash, ...result } = user;
        return result;
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
