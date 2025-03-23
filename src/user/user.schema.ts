import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

/**
 * User schema defines the structure of the user document in the database.
 * @param {string} email - The email of the user
 * @param {string} username - The username of the user
 * @param {string} nickname - The nickname of the user
 * @param {string} password - The password of the user
 * @param {string} role - The role of the user (e.g., admin, user)
 * @param {Date} createdAt - The date the user was created
 * This schema defines the structure of a user and how it is stored in the database.
 */
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
