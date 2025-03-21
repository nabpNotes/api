import { Injectable, UnauthorizedException} from "@nestjs/common";
import {AuthService} from "../auth/auth.service";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User, UserDocument} from "./user.schema";

@Injectable()
export class UserService {
    constructor(
        private readonly authService: AuthService, // No need for @Inject()
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async findAll(token: string) {
        const decoded = this.authService.validateTokenWithBearer(token);
        if (!decoded) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        return await this.userModel.find().select('username profilePictureExt').exec();
    }
}
