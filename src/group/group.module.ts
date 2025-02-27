import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from "@nestjs/mongoose";
import { Group, GroupSchema } from "./group.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{name: Group.name, schema: GroupSchema}]),
    AuthModule,
  ],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {
}
