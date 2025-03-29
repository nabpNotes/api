import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; // Importiere MongooseSchema
import { Type } from "class-transformer";
import { ListItemSchema } from "../list-item/list-item.schema";

export type ListDocument = List & Document;

@Schema({collection: 'lists'})
export class List {

  @Prop({ required: true })
  name: string;

  @Prop({ type: [ListItemSchema], required: false })
  @Type(() => ListItem)
  listItems: ListItem[];

  @Prop({ required: true, default: () => Date.now() })
  createdAt: number;
}


class ListItem {
  @Prop({ required: true })
  itemId: string;

  @Prop({ required: true })
  addedAt: Date;
}

export const ListSchema = SchemaFactory.createForClass(List);