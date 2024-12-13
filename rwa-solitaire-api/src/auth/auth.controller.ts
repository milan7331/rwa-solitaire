import { Controller, Post, Get, Request, UseGuards, Logger, Body, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

// import { Guard } from './auth.guard';
import { Public } from './auth.decorators';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: any) {
        // popraviti request da jebeno ne bude any
        // popraviti da se koristi dedicated dto i validaciju uključiti na nivou projekta
        // return this.authService.signIn(signInDto.username, signInDto.password);
        return this.authService.login(req.user);
    }

    @HttpCode(HttpStatus.CREATED)
    @Public()
    @Post('register')
    async register(@Request() req: any) {
        // register gg
    }

    @Public()
    @Get()
    async publicTest() { return 'publicTest' }

    @Get()
    async authTest() { return 'authorizedTest'}

}
