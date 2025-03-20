import {Controller, Headers, Get, UnauthorizedException, Post, Body} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    /**
     * This endpoint validates jwt
     * @param authHeader
     */
    @Get('')
    validateToken(@Headers('authorization') authHeader: string): { valid: boolean } {
        const isValid = this.authService.validateTokenWithBearer(authHeader);

        if (!isValid) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        return {valid: true};
    }

    /**
     * This endpoint logs in a user
     * @param body {username: string, password: string}- The body of the request
     */
    @Post('login')
    async login(@Body() body: { username: string, password: string }) {
        const user = await this.authService.login(body.username, body.password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            token: this.authService.createToken({sub: user._id, username: user.username}),
            username: user.username,
            nickname: user.nickname,
            userRole: user.role,
            userId: user._id
        };
    }

    /**
     * This endpoint registers a user
     * @param body {email: string, username: string, password: string}- The body of the request
     */
    @Post('register')
    async register(@Body() body: { email:string, username: string, password: string }) {
        const user = await this.authService.register(body.email, body.username, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            token: this.authService.createToken({sub: user._id, username: user.username}),
            username: user.username,
            nickname: user.nickname,
            userRole: user.role
        };
    }
}
