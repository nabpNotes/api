import {Controller, Get, Post, Body, Headers, UnauthorizedException, Param} from '@nestjs/common';
import {ListService} from "./list.service";
import {identity} from "rxjs";

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get(':groupId')
  findAllInGroup(@Headers('authorization') authHeader: string, @Param('groupId') groupId: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or malformed token');
    }

    const token = authHeader.split(' ')[1];

    return this.listService.findAllInGroup(token, groupId);
  }
}
