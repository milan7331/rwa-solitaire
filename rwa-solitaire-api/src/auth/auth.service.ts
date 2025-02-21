import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/resources/user/user.service';
import { User } from 'src/resources/user/entities/user.entity';
import { FindUserDto } from 'src/resources/user/dto/find-user.dto';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    // find one also checks for password matching, no need to call the hashService derictly
    async validateUser(username: string, password: string): Promise<User | null> {
        const findUserDto: FindUserDto = {
            username,
            password: password,
            withDeleted: false,
            withRelations: false,
        }

        const user = await this.userService.findOne(findUserDto);
        
        if (!user) return null;
        return { ...user, passwordHash: '' } as User;
    }

    async login(req: Request, res: Response): Promise<void> {
        const user = req.user as User;
        const payload = {
            sub: user.id,
            username: user.username,
            iat: Math.floor(Date.now() / 1000),
            eat: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
        };

        const token = await this.jwtService.signAsync(payload);

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        })

        return;
    }
}
