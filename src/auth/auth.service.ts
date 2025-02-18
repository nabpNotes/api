import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    /**
     * This function validates a jwt
     * @param token
     */
    validateToken(token: string) {
        try {
            const decoded = this.jwtService.verify(token);
            return !!decoded;
        } catch (error) {
            return false;
        }
    }

    //TODO muss noch raus
    createToken() {
        return this.jwtService.sign({test:'test'});
    }
}
