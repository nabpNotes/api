import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema({collection: 'groups'})
export class Group {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true })
    members: Member[];

    @Prop({ required: true })
    lists: List[];

    @Prop({ required: true })
    createdAt: Date;
}

class Member {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    role: string;

    @Prop({ required: true })
    joinedAt: Date;
}

class List {
    @Prop({ required: true })
    listId: string;

    @Prop({ required: true })
    addedAt: Date;
}

export const GroupSchema = SchemaFactory.createForClass(Group);