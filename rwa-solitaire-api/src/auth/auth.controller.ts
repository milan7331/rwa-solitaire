import { Controller, Post, Get, Request, UseGuards, Logger, Body, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SkipAuth } from './auth.decorators';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @SkipAuth()
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        // popraviti da se koristi dedicated dto i validaciju uključiti na nivou projekta
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @Get('profile')
    getProfile(@Request() req: any) {
        return req.user;
    }

}
