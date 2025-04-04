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

    /**
     * This function validates a jwt with Bearer
     * @param authHeader - The authorization header
     */
    validateTokenWithBearer(authHeader: string) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or malformed token');
        }

        const tokenString = authHeader.split(' ')[1];
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

        //const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPassword = await this.createHashedPassword(password);
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

    /**
     * This function creates a hashed password
     * @param password
     */
    async createHashedPassword(password: string): Promise<string> {
        if (!password) {
            throw new Error("Password is required and cannot be empty.");
        }

        return await bcrypt.hash(password, 10);
    }

    /**
     * This function compares two passwords with bcrypt
     * @param passwordA the first password
     * @param passwordB the second password
     */
    async comparePassword(passwordA: string, passwordB: string) {
        return await bcrypt.compare(passwordA, passwordB);
    }

}
