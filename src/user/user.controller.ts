import { Controller, Get, Headers } from "@nestjs/common";
import { UserService } from "./user.service";

/**
 * UserController handles user-related requests.
 * @returns {Promise<any>} - The response for user-related requests
 * This controller provides an endpoint to fetch all users. It validates the request using the authorization token
 * passed in the headers and delegates the logic to the UserService.
 */
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    /**
     * This function retrieves all users
     * @param {string} authHeader - The authorization header containing the token
     * @returns {Promise<User[]>} - The list of users
     * This method calls the UserService to fetch all users after validating the provided token.
     */
    @Get()
    findAll(@Headers('authorization') authHeader: string): Promise<any> {
        return this.userService.findAll(authHeader);
    }
}