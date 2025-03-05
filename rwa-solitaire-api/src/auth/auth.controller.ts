import { Controller, Post, Req, UseGuards, Get, Res, HttpStatus } from '@nestjs/common';
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
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.login(req, res);
    }

    @Post('logout')
    @Post('log-out')
    async logout(@Res({ passthrough: true }) res: Response) {
        return this.authService.logout(res);
    }

    @Post('validate-session')
    async validateSession() {
        // global jwt auth guard does the validation,
        // this metod executes only if its valid & just returns a confirmation
        return {
            statusCode: HttpStatus.OK,
            message: 'Session valid!'
        }
    }

    @Public()
    @Get()
    async test() {
        return { message: 'API works as intended' };
    }
}
