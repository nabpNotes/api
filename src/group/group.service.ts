import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from '../auth/auth.service';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Group, GroupDocument} from "./group.schema";
import {CreateGroupDto} from "./dto/create-group.dto";

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

  /**
   * This function creates a new group
   * @param {string} token - The token of the user creating the group
   * @param {CreateGroupDto} createGroupDto - The data to create the group
   * @returns {object} - An object with success status and a message
   * This function handles the creation of a new group, including setting default values for the creation date and lists,
   * and saves the group to the database.
   */
  async create(token: string, createGroupDto: CreateGroupDto) {
    const decoded = this.authService.validateTokenWithBearer(token);
    if (!decoded) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    try {
      if (!createGroupDto.createdAt) {
        createGroupDto.createdAt = Date.now();
      }

      if (!createGroupDto.lists) {
        createGroupDto.lists = [];
      }

      const group = new this.groupModel(createGroupDto);
      await group.save();
      return { success: true, message: "Successfully created group" };
    } catch (error) {
      console.error("Error occurred while creating Group:", error);
      return { success: false, message: "Could not create new group" };
    }
  }
}
