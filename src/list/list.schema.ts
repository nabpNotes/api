import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; // Importiere MongooseSchema
import { Type } from "class-transformer";

export type ListDocument = List & Document;

@Schema({collection: 'lists'})
export class List {

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  @Type(() => ListItem)
  listItems: ListItem[];

  @Prop({ required: true, default: () => Date.now() })
  createdAt: number;
}

class ListItem {
  @Prop({ required: true })
  itemId: string;

  @Prop({ required: true })
  addedAt: number;
}

export const ListSchema = SchemaFactory.createForClass(List);