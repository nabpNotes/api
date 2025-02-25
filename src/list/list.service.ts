import {Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from "../auth/auth.service";
import {InjectModel, } from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {List, ListDocument} from "./list.schema";
import {Group, GroupDocument} from "../group/group.schema";

/**
 * This service handles list related operations
 */
@Injectable()
export class ListService {
    constructor(private readonly authService: AuthService, @InjectModel(Group.name) private group: Model<GroupDocument>, @InjectModel(List.name) private list: Model<ListDocument>) {
    }

    /**
     * This function finds all lists in a group
     * @param token - The token of the user
     * @param id - The id of the group
     * @returns The lists
     */
    async findAllInGroup(token: string, id: string) {
        const decoded = this.authService.validateToken(token);
        let listIds: string[] = [];

        if (!decoded) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        const groupData = await this.group.findById(id).exec();

        if (!groupData) {
            throw new UnauthorizedException('Group not found');
        }
        if (!groupData.members.some(member => member.userId === decoded.sub)) {
            throw new UnauthorizedException('User not in group');
        }
        for (const list of groupData.lists) {
            listIds.push(list.listId);
        }
        return await this.list.find({
            _id: {
                $in: listIds
            }
        }).exec();
        /*return await this.group.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(id),
                    "members.userId": decoded.sub
                }
            },
            {
                $unwind: "$lists"
            },
            {
                $lookup: {
                    from: "lists",
                    let: { listIdStr: "$lists.listId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [{ $toString: "$_id" }, "$$listIdStr"]
                                }
                            }
                        }
                    ],
                    as: "listData"
                }
            },
            {
                $unwind: "$listData"
            },
            {
                $replaceRoot: { newRoot: "$listData" }
            }
        ]).exec();*/
    }
}
