import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ListDocument = List & Document;

@Schema({collection: 'lists'})
export class List {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  listItems: ListItem[];

  @Prop({ required: true })
  createdAt: Date;
}

class ListItem {
  @Prop({ required: true })
  itemId: string;

  @Prop({ required: true })
  addedAt: Date;
}

export const ListSchema = SchemaFactory.createForClass(List);