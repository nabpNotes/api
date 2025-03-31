import {Controller, Get, Delete, Patch, Headers, Param, Body, Post} from '@nestjs/common';
import { GroupService } from './group.service';
import {CreateGroupDto} from "./dto/create-group.dto";
import { AddUserToGroupDto } from './dto/add-user-to-group.dto';

/**
 * This controller handles group related operations
 */
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  /**
   * This function finds all groups of a user
   * @param authHeader - The authorization header
   * @returns The groups
   */
  @Get()
  findAll(@Headers('authorization') authHeader: string) {
    return this.groupService.findAll(authHeader);
  }

  @Get(':id/user')
  findAllUser(@Headers('authorization') authHeader: string, @Param('id') id: string) {
    return this.groupService.findAllUser(authHeader , id);
  }

  @Get(':id')
  findOne(@Headers('authorization') authHeader: string, @Param('id') id: string) {
    return this.groupService.findOne(authHeader, id);
  }

  @Post()
  create(@Headers('authorization') authHeader: string, @Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(authHeader, createGroupDto);
  }

  @Patch(':chatId/add/user/:nickname')
  addGroupMember(@Headers('authorization') authHeader: string, @Param('chatId') chatid: string, @Param('nickname') nickname: string) {
    return this.groupService.addGroupMember(authHeader, chatid, nickname);
  }

  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(+id, updateGroupDto);
}*/

  @Delete(':id')
  delete(@Headers('authorization') authHeader: string, @Param('id') id: string) { 
    return this.groupService.delete(authHeader, id);
  }

  @Patch(':chatId/user/:userId')
  removeUser(@Headers('authorization') authHeader: string, @Param('chatId') chatid: string, @Param('userId') id: string) {
    console.log(authHeader, chatid, id);
    console.log("Test");
    return this.groupService.removeUser(authHeader,chatid, id);
  }
}
