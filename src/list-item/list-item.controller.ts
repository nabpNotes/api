import {Body, Controller, Headers, Param, Post, Put} from '@nestjs/common';
import {ListItemService} from "./list-item.service";

@Controller('list-item')
export class ListItemController {
    constructor(private readonly listItemService: ListItemService) {
    }

    /**
     * This function updates a list item
     * @param authHeader - The authorization header
     * @param id - The id of the list item
     * @param body - The body of the request
     * @returns The updated list item
     */
    @Put(':id')
    update(@Headers('authorization') authHeader: string, @Param('id') id: string, @Body() body: any) {
        return this.listItemService.update(authHeader, body.listId, id, body);
    }

    /**
     * Handles the creation of a new list item.
     *
     * Receives the authorization header and list item data from the request body,
     * then calls the service to create and add the item to the list.
     *
     * @param {string} authHeader - The authorization header containing the user's token.
     * @param {Object} body - The request body containing the list ID and item data.
     * @returns {Object} - The result from the service function (success or error message).
     */
    @Post('')
    create(@Headers('authorization') authHeader: string, @Body() body: any) {
        return this.listItemService.create(authHeader, body.listId, body);

    }
}
