import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ListDocument = List & Document;

@Schema({collection: 'lists'})
export class List {
  @Prop()
  name: string;

  @Prop()
  description: string;
}

export const ListSchema = SchemaFactory.createForClass(List);