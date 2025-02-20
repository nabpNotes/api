import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({collection: 'users'})
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    nickname: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    role: string;

    @Prop({ required: true })
    createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);