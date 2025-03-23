import { Controller, Post, Req, UseGuards, Get, Res, Delete, Query } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { Public } from './auth.decorators';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @Post('log-in')
    async login(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authService.login(req, res);
    }

    @Delete('logout')
    @Delete('log-out')
    async logout(@Res({ passthrough: true }) res: Response) {
        return this.authService.logout(res);
    }

    @Post('validate-session')
    @Post('validate_session')
    async validateSession(
        @Query() username: string,
        @Res({ passthrough: true }) res: Response
    ) {        
        // global jwt auth guard does the cookie validation,
        // this metod executes only if the cookie is valid,
        // then checks for a valid username
        return this.authService.validateSession(username, res);
    }

    @Public()
    @Get()
    async test() {
        return 'API works as intended';
    }
}
