import {BadRequestException, Body, Controller, Delete, Get, Headers, Param, Patch} from "@nestjs/common";
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

    /**
     * This function patches the user's nickname
     * @param authHeader the authorization header containing the token
     * @param newNickname the new nickname
     */
    @Patch('nickname')
    async updateNickname(
        @Headers('authorization') authHeader: string,
        @Body('nickname') newNickname: string
    ) {
        return this.userService.updateNickname(authHeader, newNickname);
    }

    /**
     * This function deletes the user
     * @param authHeader the authorization header containing the token
     */
    @Delete()
    async deleteUser(
        @Headers('authorization') authHeader: string,
    ){
        return this.userService.deleteUser(authHeader);
    }

    /**
     * This function updates the user's password
     * @param authHeader the authorization header containing the token
     * @param body the request body
     */
    @Patch('password')
    async updatePassword(
        @Headers('authorization') authHeader: string,
        @Body() body: { password: string }
    ) {
        if (!body.password) {
            throw new BadRequestException("Password is required.");
        }

        return this.userService.updatePassword(authHeader, body.password);
    }
}