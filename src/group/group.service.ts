import {Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from '../auth/auth.service';
import {CreateGroupDto} from './dto/create-group.dto';
import {UpdateGroupDto} from './dto/update-group.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Group, GroupDocument} from "./group.schema";

@Injectable()
export class GroupService {
  constructor(private readonly authService: AuthService, @InjectModel(Group.name) private groupModel: Model<GroupDocument>) {}

  async findAll(token: string) {
    const decoded = this.authService.validateToken(token);
    if (!decoded) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return await this.groupModel.find({
      'members.userId': decoded.sub
    }).exec();
  }
}
