import {Controller, Get, Headers, UnauthorizedException, Param} from '@nestjs/common';
import { GroupService } from './group.service';

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
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or malformed token');
    }

    const token = authHeader.split(' ')[1];

    return this.groupService.findAll(token);
  }

  @Get(':id')
  findOne(@Headers('authorization') authHeader: string, @Param('id') id: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or malformed token');
    }

    const token = authHeader.split(' ')[1];

    return this.groupService.findOne(token, id);
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
