import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from '../auth/auth.service';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Group, GroupDocument} from "./group.schema";
import {CreateGroupDto} from "./dto/create-group.dto";
import { AddUserToGroupDto } from './dto/add-user-to-group.dto';
import { UserService } from 'src/user/user.service';

/**
 * This service handles group related operations
 */
@Injectable()
export class GroupService {
  constructor(
      @Inject(AuthService) private authService: AuthService,
      @Inject(UserService) private userService: UserService,
      @InjectModel(Group.name) private groupModel: Model<GroupDocument>
  ) {}

  /**
   * This function finds all groups of a user
   * @param {string} token - The token of the user
   * @returns {object} The groups
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
   * @param {string} token - The token of the user
   * @param {string} id - The id of the group
   * @returns {object} The group
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
   * This function returns all members of a Group
   * @param {string} token - The token of the user
   * @param {string} chatId - The id of the group
   * @returns {object} The members of the group
   */
  async findAllUser(token: string, chatId: string) {
    const decoded = this.authService.validateTokenWithBearer(token);
    const MemberList: any[] = [];
    if (!decoded) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const group = await this.groupModel.findOne({
      $and: [{_id: chatId}, {'members.userId': decoded.sub}]
    }).exec();

    if (!group) {
      throw new UnauthorizedException('Group not found');
    }
    for (const member of group.members) {
      const user = await this.userService.findById(member.userId);
      MemberList.push(user);
    }
    return MemberList;
  }

  /**
   * This function adds a user to a group
   * @param {string} token - The token of the user
   * @param {string} groupId - The id of the group
   * @param {string} username - The username of the new user
   * @returns {object} The group the user was added to
   */
  async addGroupMember(token: string, groupId: string, username: string,) {
    const decoded = this.authService.validateTokenWithBearer(token);
    if (!decoded) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const user = await this.userService.findByNickname(username);
    if (!user) throw new UnauthorizedException('User not found');
    const group = await this.findOne(token, groupId);
    if (!group) throw new UnauthorizedException('Group not found');
    console.log(group, user._id);
    const member = group.members.find(member => member.userId === user._id);
    if (member) throw new UnauthorizedException('User already in group');

    return await this.groupModel.findOneAndUpdate({
      $and: [{_id: groupId}, {'members.userId': decoded.sub}]
    }, {
      $push: {
        members: {
          userId: user._id,
          role: "user",
        }
      }
    }, {
      new: true
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
  
  /**
   * This function deletes a group
   * @param {string} token - The token of the user
   * @param {string} id - The id of the group to delete
   * @returns {object} - An object with success status and a message  
   */
  async delete(token: string, id: string) {
    try {
    const decoded = this.authService.validateTokenWithBearer(token);
    if (!decoded) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const group = await this.groupModel.findById(id).exec();
    if (!group) {
      throw new UnauthorizedException('Group not found');
    }
    if (group.members.some((member) => member.userId === decoded.sub && member.role !== "groupadmin")) {
      throw new UnauthorizedException('You are not the owner of this group');
    }

    await this.groupModel.findByIdAndDelete(id).exec();
    return { success: true, message: "Successfully deleted group" };
    } catch (error) {
      console.error("Fehler beim Löschen der Gruppe:", error);
      return { success: false, message: "Could not delete group" };
    }
  }

  /**
   * This function removes a user from a group
   * @param {string} token - The token of the user
   * @param {string} groupId - The id of the group
   * @param {string} userId - The id of the user to remove
   * @returns {object} - An object with success status and a message
   */
  async removeUser(token: string, groupId: string, userId: string) {
    try {
      const decoded = this.authService.validateTokenWithBearer(token);
      if (!decoded) {
        throw new UnauthorizedException('Invalid or expired token');
      }
      
      const group = await this.groupModel.findById(groupId).exec();
      if (!group) {
        throw new UnauthorizedException('Group not found');
      }
      if (group.members.some((member) => member.userId === decoded.sub && member.role !== "groupadmin")) {
        throw new UnauthorizedException('You are not the owner of this group');
      }
      if (userId === decoded.sub) {
        throw new UnauthorizedException('You cannot remove yourself');
      }
      if (!group.members.some((member) => member.userId === userId)) {
        throw new UnauthorizedException('User not in group');
      }
  
      group.members = group.members.filter((member) => member.userId !== userId);
      await group.save();
      return { success: true, message: "Successfully removed user from group" };
    } catch (error) {
      console.error("Fehler beim Löschen der Gruppe:", error);
      return { success: false, message: "Could not remove user from group" };
    }
  }

}
