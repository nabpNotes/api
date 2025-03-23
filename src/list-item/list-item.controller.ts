import {Body, Controller, Headers, Param, Put} from '@nestjs/common';
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
        console.log(authHeader);
        console.log(id);
        console.log(body);
        return this.listItemService.update(authHeader, body.listId, id, body);
    }
}
