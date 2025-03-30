import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from "../auth/auth.service";
import {InjectModel} from "@nestjs/mongoose";
import {ListItem, ListItemDocument} from "./list-item.schema";
import {List, ListDocument} from "../list/list.schema";
import {Group, GroupDocument} from "../group/group.schema";
import {Model, Types} from "mongoose";
import {Server} from 'socket.io';

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

    private server: Server;

    setServer(server: Server) {
        this.server = server;
    }

    /**
     * This function finds all list items in a list and checks if user can access them
     * @param authHeader - The authorization header
     * @param listId - The id of the list
     * @returns The list items
     */
    async findAllInList(authHeader: string, listId: string) {
        const list = await this.checkIfUserCanAccessList(authHeader, listId);

        let itemIds: string[] = [];

        for (const listItem of list.listItems) {
            const listItemObj = JSON.parse(JSON.stringify(listItem));
            itemIds.push(listItemObj.itemId);
        }

        return await this.listItemModel.find({
            _id: {
                $in: itemIds
            }
        }).exec();
    }

    /**
     * This function updates a list item
     * @param authHeader - The authorization header
     * @param listId - The id of the list
     * @param itemId - The id of the item
     * @param data - The data to update
     * @returns The updated list item
     */
    async update(authHeader: string, listId: string, itemId: string, data: any) {
        const list = await this.checkIfUserCanAccessList(authHeader, listId);
        if (!list) {
            throw new UnauthorizedException('List item not found');
        }
        const listItem = await this.listItemModel.findByIdAndUpdate(itemId, data, {new: true}).exec();
        this.server.to(listId).emit('listItemUpdate', listItem);
        return listItem;
    }

    /**
     * This function checks if the user can access a list
     * @param authHeader - The authorization header
     * @param listId - The id of the list
     * @returns The list
     */
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

    /**
     * Creates a new list item and adds it to the specified list.
     *
     * Validates the type and creates the item based on the type ('text' or 'checklist').
     * Saves the item and adds it to the list’s listItems array.
     *
     * @param {string} authHeader - The authorization header with the user's token.
     * @param {string} listId - The ID of the list to add the item to.
     * @param {Object} data - The data for the new list item (type, title, text/checklistItems).
     * @returns {Object} - Success or error message.
     */
    async create(authHeader: string, listId: string, data: any) {
        const list = await this.checkIfUserCanAccessList(authHeader, listId);

        if (!data.type) throw new Error("Type is required.");

        let newItem;
        if (data.type == "text") {
            newItem = new this.listItemModel({
                type: data.type,
                title: data.title,
                text: data.text
            });
        } else if (data.type == "checklist") {
            newItem = new this.listItemModel({
                type: data.type,
                title: data.title,
                checklistItems: data.checklistItems
            });
        } else {
            return { success: false, message: "Invalid type"};
        }

        await newItem.save();

        const itemToAdd = {
            itemId: (newItem._id as Types.ObjectId).toString(),
            addedAt: Date.now()
        };

        list.listItems.push(itemToAdd);

        await list.save();

        return { success: true, message: "item successfully created"};
    }
}
