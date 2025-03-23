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
}
