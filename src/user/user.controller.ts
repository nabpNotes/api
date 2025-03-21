import {Controller, Get, Headers} from "@nestjs/common";
import {UserService} from "./user.service";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    /**
     * This function finds all groups of a user
     * @param authHeader - The authorization header
     * @returns The groups
     */
    @Get()
    findAll(@Headers('authorization') authHeader: string) {
        return this.userService.findAll(authHeader);
    }
}