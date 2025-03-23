import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {AuthModule} from "../auth/auth.module";
import {ListItemService} from "./list-item.service";
import {ListItem, ListItemSchema} from "./list-item.schema";
import {Group, GroupSchema} from "../group/group.schema";
import {List, ListSchema} from "../list/list.schema";
import { ListItemController } from './list-item.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: ListItem.name, schema: ListItemSchema},
            {name: List.name, schema: ListSchema},
            {name: Group.name, schema: GroupSchema},
        ]),
        AuthModule,
    ],
    providers: [ListItemService],
    exports: [ListItemService],
    controllers: [ListItemController],
})
export class ListItemModule {}
