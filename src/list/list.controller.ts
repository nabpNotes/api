import {Controller, Get, Post, Body, Headers, Param} from '@nestjs/common';
import {ListService} from "./list.service";
import {CreateListDto} from "./dto/create-list.dto";

/**
 * This controller handles list related operations
 */
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  /**
   * This function finds all lists in a group
   * @param authHeader - The authorization header
   * @param groupId - The id of the group
   * @returns The lists
   */
  @Get(':groupId')
  findAllInGroup(@Headers('authorization') authHeader: string, @Param('groupId') groupId: string) {
    return this.listService.findAllInGroup(authHeader, groupId);
  }


  @Post(':groupId')
  create(@Headers('authorization') authHeader: string, @Param('groupId') groupId: string, @Body() createListDto: CreateListDto) {
    return this.listService.create(authHeader, groupId, createListDto);
  }


}
