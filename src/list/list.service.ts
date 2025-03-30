import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from "../auth/auth.service";
import {InjectModel,} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {List, ListDocument} from "./list.schema";
import {Group, GroupDocument} from "../group/group.schema";
import {CreateListDto} from "./dto/create-list.dto";

/**
 * This service handles list related operations
 */
@Injectable()
export class ListService {
    constructor(
        @Inject(AuthService) private authService: AuthService,
        @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
        @InjectModel(List.name) private listModel: Model<ListDocument>,
    ) {}

    /**
     * This function finds all lists in a group
     * @param authHeader
     * @param id - The id of the group
     * @returns The lists
     */
    async findAllInGroup(authHeader: string, id: string) {
        const decoded = this.authService.validateTokenWithBearer(authHeader);
        let listIds: string[] = [];

        if (!decoded) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        const groupData = await this.groupModel.findById(id).exec();

        if (!groupData) {
            throw new UnauthorizedException('Group not found');
        }

        if (!groupData.members.some(member => member.userId === decoded.sub)) {
            throw new UnauthorizedException('User not in group');
        }

        for (const list of groupData.lists) {
            listIds.push(list.listId);
        }

        return await this.listModel.find({
            _id: {
                $in: listIds
            }
        }).exec();
    }

    /**
     * This function finds a list by id
     * @param token - The token of the user
     * @param id - The id of the list
     * @returns The list
     */
    async findOne(token: string, id: string) {
        const decoded = this.authService.validateTokenWithBearer(token);
        if (!decoded) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        const list = await this.listModel.findById(id).exec();
        if (!list) {
            throw new UnauthorizedException('List not found');
        }

        const group = await this.groupModel.findOne({lists: {$elemMatch: {listId: id}}}).exec();
        if (!group) {
            throw new UnauthorizedException('Group not found');
        }

        if (!group.members.some(member => member.userId === decoded.sub)) {
            throw new UnauthorizedException('User not in group');
        }

        return list;
    }

    async create(token: string, groupId: string, createListDto: CreateListDto) {
        const decoded = this.authService.validateTokenWithBearer(token);
        if (!decoded) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        try {
            const group = await this.groupModel.findById(groupId);
            if (!group) {
                console.error("Group not found for ID:", groupId);
                return { success: false, message: "Group not found" };
            }

            if (!createListDto.createdAt) {
                createListDto.createdAt = Date.now();
            }

            const list = new this.listModel(createListDto) as ListDocument;
            await list.save();

            const listToAdd = {
                listId: (list._id as Types.ObjectId).toString(),
                addedAt: Date.now(),
            };

            group.lists.push(listToAdd);

            await group.save();


            console.log("Updated group with new list:", group);

            return { success: true, message: "List created and added to group", data: list };

        } catch (error) {
            console.error("Error occurred while creating List:", error);
            return {success: false, message: "Could not create new List"};
        }
    }
}
