import {Controller, Headers, Get, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    /**
     * This endpoint validates jwt
     * @param authHeader
     */
    @Get('validate-token')
    validateToken(@Headers('authorization') authHeader: string): { valid: boolean } {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or malformed token');
        }

        const token = authHeader.split(' ')[1];
        const isValid = this.authService.validateToken(token);

        if (!isValid) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        return {valid: true};
    }

    //TODO muss noch raus
    @Get('token')
    createToken(@Headers('authorization') authHeader: string): { token: string } {
        return {token: this.authService.createToken()};
    }
}
