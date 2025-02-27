import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListGateway } from './list.gateway';
import {MongooseModule} from "@nestjs/mongoose";
import {AuthModule} from "../auth/auth.module";
import {ListController} from "./list.controller";
import {List, ListSchema} from "./list.schema";
import {Group, GroupSchema} from "../group/group.schema";
import {GroupModule} from "../group/group.module";

@Module({
  imports: [
    MongooseModule.forFeature([{name: Group.name, schema: GroupSchema}]),
    MongooseModule.forFeature([{name: List.name, schema: ListSchema}]),
    AuthModule,
  ],
  controllers: [ListController],
  providers: [ListGateway, ListService],
})
export class ListModule {}
