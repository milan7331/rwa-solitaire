import { Controller, Post, Request, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { Request as ExpressRequest} from 'express';

import { AuthService } from './auth.service';
import { Public } from './auth.decorators';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: ExpressRequest) {
        return this.authService.login(req.user);
    }


    // ovo bi trebalo da ide u user module??
    // @HttpCode(HttpStatus.CREATED)
    // @Public()
    // @Post('register')
    // async register(@Request() req: any) {
    //     // register gg
    // }

    // @Public()
    // @Get()
    // async publicTest() { return 'publicTest' }

    // @Get()
    // async authTest() { return 'authorizedTest'}

}
