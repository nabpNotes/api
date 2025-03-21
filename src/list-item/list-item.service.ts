import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from "../auth/auth.service";
import {InjectModel} from "@nestjs/mongoose";
import {ListItem, ListItemDocument} from "./list-item.schema";
import {List, ListDocument} from "../list/list.schema";
import {Group, GroupDocument} from "../group/group.schema";
import {Model} from "mongoose";

/**
 * This service handles list item related operations
 */
@Injectable()
export class ListItemService {
    constructor(
        @Inject(AuthService) private authService: AuthService,
        @InjectModel(ListItem.name) private listItemModel: Model<ListItemDocument>,
        @InjectModel(List.name) private listModel: Model<ListDocument>,
        @InjectModel(Group.name) private groupModel: Model<GroupDocument>
    ) {}

    /**
     * This function finds all list items in a list and checks if user can access them
     * @param authHeader
     * @param listId - The id of the list
     * @returns The list items
     */
    async findAllInList(authHeader: string, listId: string) {
        const list = await this.checkIfUserCanAccessList(authHeader, listId);

        let itemIds: string[] = [];

        for (const listItem of list.listItems) {
            itemIds.push(listItem.itemId);
        }

        return await this.listItemModel.find({
            _id: {
                $in: itemIds
            }
        }).exec();
    }

    async update(authHeader: string, listId: string, itemId: string, data: any) {
        const list = await this.checkIfUserCanAccessList(authHeader, listId);

        const listItem = list.listItems.find(listItem => listItem.itemId === itemId);
        if (!listItem) {
            throw new UnauthorizedException('List item not found');
        }
        console.log(data);
        return await this.listItemModel.findByIdAndUpdate(listItem.itemId, data, {new: true}).exec();
    }

    async checkIfUserCanAccessList(authHeader: string, listId: string) {
        const decoded = this.authService.validateTokenWithBearer(authHeader);

        if (!decoded) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        const list = await this.listModel.findById(listId).exec();
        if (!list) {
            throw new UnauthorizedException('List not found');
        }

        const group = await this.groupModel.findOne({lists: {$elemMatch: {listId: listId}}}).exec();
        if (!group) {
            throw new UnauthorizedException('Group not found');
        }

        if (!group.members.some(member => member.userId === decoded.sub)) {
            throw new UnauthorizedException('User not in group');
        }
        return list;
    }
}
