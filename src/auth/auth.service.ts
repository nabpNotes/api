import {ConflictException, Injectable} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "../user/user.schema";
import {Model} from "mongoose";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, @InjectModel(User.name) private userModel: Model<UserDocument>) {}

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
        const result_1 = await bcrypt.compare(password, user.password);
        return result_1 ? user : null;
    }

    /**
     * This function registers a new user
     * @param email - The email of the user
     * @param username - The username of the user
     * @param password - The password of the user
     * @returns The new user
     */
    async register(email: string, username: string, password: string) {
        const existingUser = await this.userModel.findOne({email}).exec();
        if (existingUser) {
            throw new ConflictException('E-Mail bereits vergeben');
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
