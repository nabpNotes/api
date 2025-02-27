import {ConflictException, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "../user/user.schema";
import {Model} from "mongoose";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        @Inject(JwtService) private jwtService: JwtService,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    /**
     * This function validates a jwt
     * @param token
     */
    validateToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            return null;
        }
    }

    validateTokenWithBearer(token: string) {
        if (!token || !token.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or malformed token');
        }

        const tokenString = token.split(' ')[1];
        return this.validateToken(tokenString);
    }

    /**
     * This function logs in a user
     * @param username - The username of the user
     * @param password - The password of the user
     * @returns The user
     */
    async login(username: string, password: string) {
        const user = await this.userModel.findOne({
            $or: [{username: username}, {email: username}]
        }).exec();
        if (!user) {
            return null;
        }
        const result = await bcrypt.compare(password, user.password);
        return result ? user : null;
    }

    /**
     * This function registers a new user
     * @param email - The email of the user
     * @param username - The username of the user
     * @param password - The password of the user
     * @returns The new user
     */
    async register(email: string, username: string, password: string) {
        if (await this.userModel.findOne({email}).exec()) {
            throw new ConflictException('E-Mail already taken');
        }
        if (await this.userModel.findOne({username}).exec()) {
            throw new ConflictException('Username already taken');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({email: email, username: username, nickname: username, password: hashedPassword, role: 'user', createdAt: new Date()});
        return newUser.save();
    }

    /**
     * This function creates a jwt
     * @param payload
     */
    createToken(payload: any) {
        return this.jwtService.sign(payload);
    }
}
