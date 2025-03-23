import {Controller, Get, Headers, Param, Body, Post} from '@nestjs/common';
import { GroupService } from './group.service';
import {CreateGroupDto} from "./dto/create-group.dto";

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

  @Get(':id')
  findOne(@Headers('authorization') authHeader: string, @Param('id') id: string) {
    return this.groupService.findOne(authHeader, id);
  }

  @Post()
  create(@Headers('authorization') authHeader: string, @Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(authHeader, createGroupDto);
  }


  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(+id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(+id);
  }*/
}
