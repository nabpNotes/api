import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from '../auth/auth.service';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Group, GroupDocument} from "./group.schema";

/**
 * This service handles group related operations
 */
@Injectable()
export class GroupService {
  constructor(
      @Inject(AuthService) private authService: AuthService,
      @InjectModel(Group.name) private groupModel: Model<GroupDocument>
  ) {}

  /**
   * This function finds all groups of a user
   * @param token - The token of the user
   * @returns The groups
   */
  async findAll(token: string) {
    const decoded = this.authService.validateTokenWithBearer(token);
    if (!decoded) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return await this.groupModel.find({
      'members.userId': decoded.sub
    }).exec();
  }

  /**
   * This function finds a group by id
   * @param token - The token of the user
   * @param id - The id of the group
   * @returns The group
   */
  async findOne(token: string, id: string) {
    const decoded = this.authService.validateTokenWithBearer(token);
    if (!decoded) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return await this.groupModel.findOne({
      $and: [{_id: id}, {'members.userId': decoded.sub}]
    }).exec();
  }
}
