import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListGateway } from './list.gateway';
import {MongooseModule} from "@nestjs/mongoose";
import {AuthModule} from "../auth/auth.module";
import {ListController} from "./list.controller";
import {List, ListSchema} from "./list.schema";
import {Group, GroupSchema} from "../group/group.schema";
import {ListItemService} from "../list-item/list-item.service";
import {ListItemModule} from "../list-item/list-item.module";


@Module({
  imports: [
    MongooseModule.forFeature([
      {name: List.name, schema: ListSchema},
      {name: Group.name, schema: GroupSchema},
    ]),
    AuthModule,
    ListItemModule,
  ],
  controllers: [ListController],
  providers: [ListGateway, ListService],
})
export class ListModule {}
