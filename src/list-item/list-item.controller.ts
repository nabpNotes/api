import {Body, Controller, Headers, Param, Put} from '@nestjs/common';
import {ListItemService} from "./list-item.service";

@Controller('list-item')
export class ListItemController {
    constructor(private readonly listItemService: ListItemService) {
    }
    @Put(':id')
    update(@Headers('authorization') authHeader: string, @Param('id') id: string, @Body() body: any) {
        console.log(authHeader);
        console.log(id);
        console.log(body);
        return this.listItemService.update(authHeader, body.listId, id, body);
    }
}
