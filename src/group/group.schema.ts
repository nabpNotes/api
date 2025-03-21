import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Type } from 'class-transformer';

export type GroupDocument = Group & Document;

@Schema()
export class Member {
    @Prop({ required: true, unique: true })
    userId: string;

    @Prop({ required: true })
    role: string;

    @Prop({ required: true, default: () => Date.now() })
    joinedAt: number;
}
export const MemberSchema = SchemaFactory.createForClass(Member);

@Schema()
export class List {
    @Prop({ required: true })
    listId: string;

    @Prop({ required: true, default: () => Date.now() })
    addedAt: number;
}
export const ListSchema = SchemaFactory.createForClass(List);

@Schema({ collection: 'groups' })
export class Group {
    @Prop({ required: true, unique: false })
    name: string;

    @Prop({ type: [MemberSchema], required: true })
    @Type(() => Member)
    members: Member[];

    @Prop({ type: [ListSchema], required: false })
    @Type(() => List)
    lists: List[];

    @Prop({ required: true, default: Date.now })
    createdAt: number;
}
export const GroupSchema = SchemaFactory.createForClass(Group);
