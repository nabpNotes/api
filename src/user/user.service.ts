import { Injectable, UnauthorizedException} from "@nestjs/common";
import {AuthService} from "../auth/auth.service";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User, UserDocument} from "./user.schema";

/**
 * UserService handles the business logic related to users.
 * @returns {Promise<User[]>} - The list of users
 * This service is responsible for handling user data operations such as fetching users.
 * It validates the provided token before accessing user data.
 */
@Injectable()
export class UserService {
    constructor(
        private readonly authService: AuthService, // No need for @Inject()
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    /**
     * This function retrieves all users
     * @param {string} token - The authorization token of the user making the request
     * @returns {Promise<User[]>} - The list of users
     * This method validates the token using the AuthService and fetches all user data.
     */
    async findAll(token: string) {
        const decoded = this.authService.validateTokenWithBearer(token);
        if (!decoded) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        return await this.userModel.find().select('username profilePictureExt').exec();
    }

    /**
     * This function updates the user's nickname
     * @param autHeader the authorization header
     * @param newNickname the new nickname
     */
    async updateNickname(autHeader: string, newNickname: string) {
        //console.log("authHeader " + autHeader);

        const decoded = this.authService.validateTokenWithBearer(autHeader);
        if (!decoded) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        const id = decoded.sub
        //console.log(id);

        if (!id) {
            throw new UnauthorizedException('id not found in token');
        }

        return this.userModel.findByIdAndUpdate(
            id,
            {nickname: newNickname},
            {new: true}
        );
    }

    /**
     * This function deletes a user
     * @param autHeader the authorization header
     */
    async deleteUser(autHeader: string) {
        //console.log("authHeader " + autHeader);

        const decoded = this.authService.validateTokenWithBearer(autHeader);
        if (!decoded) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        const id = decoded.sub
        //console.log(id);

        if (!id) {
            throw new UnauthorizedException('id not found in token');
        }

        return this.userModel.findByIdAndDelete(id);
    }

    /**
     * This function updates the user's password
     * @param autHeader the authorization header
     * @param newPassword the new password
     * @param oldPassword the old password
     */
    async updatePassword(autHeader: string, newPassword: string, oldPassword: string) {
        const decoded = this.authService.validateTokenWithBearer(autHeader);
        if (!decoded) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        const id = decoded.sub

        if (!id) {
            throw new UnauthorizedException('id not found in token');
        }

        const user= await this.userModel.findById(id);
        if (!user) {
            console.error("User not found for ID:", id);
            throw new UnauthorizedException("Wrong old password");
        }
        const savedPassword = user.password;

        const isMatch = await this.authService.comparePassword(oldPassword, savedPassword);
        if (!isMatch) {
            console.error("wrong old password");
            throw new UnauthorizedException("wrong old password")
        }

        const hashedPassword = await this.authService.createHashedPassword(newPassword);

        return this.userModel.findByIdAndUpdate(
            id,
            {password: hashedPassword},
            {new: true}
        );
    }
}
