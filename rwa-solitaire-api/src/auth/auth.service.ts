import { Injectable } from '@nestjs/common';
import { UserService } from 'src/resources/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { DeepPartial } from 'typeorm';
import { User } from 'src/resources/user/entities/user.entity';
import { FindUserDto } from 'src/resources/user/dto/find-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    // find one also checks for password matching, no need to call the hashService derictly
    async validateUser(username: string, password: string): Promise<DeepPartial<User> | null> {
        const findUserDto: FindUserDto = {
            username,
            withDeleted: false,
            withRelations: false
        }

        const user = await this.userService.findOne(findUserDto);
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
