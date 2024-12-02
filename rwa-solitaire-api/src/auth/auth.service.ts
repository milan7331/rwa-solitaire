import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    private readonly users = [{id: 1, username: "test", password: "password"}];


    // private readonly userService: UserService, 
    constructor(private readonly jwtService: JwtService) {}

    async validateUser(username: string, password: string): Promise<any> {
        // const user = await this.userService.findByUsername(username);
        const user = this.users.find(user => user.username === username);
        if (user && user.password === password) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
