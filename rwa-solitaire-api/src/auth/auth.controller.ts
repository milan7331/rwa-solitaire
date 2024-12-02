import { Controller, Post, Get, Request, UseGuards, Logger, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() loginDto: {username: string, password: string}) {
        Logger.log("controller-method-login!!!!");
        const user = await this.authService.validateUser(
            loginDto.username,
            loginDto.password
        );
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
        
        // if (req.user) Logger.log("controller-login-user-exists");
        // else Logger.log("controller-login-user-doesnt-exist");
        // return req.user;
    }


    @UseGuards(JwtAuthGuard)
    @Get('protected-default')
    getProtectedDefault() {
        return 'protected-default-test';
    }

//   getProtectedResource(@Request() req) {
//     return { message: 'This is a protected route!', user: req.user };
//   }

    @Get()
    defaultGet() {
        Logger.log("auth-default-controller-get!!!");
        return "Wowowowowo";
    }
}
