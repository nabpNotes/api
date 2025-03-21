import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type ListItemDocument = ListItem & Document;

@Schema({collection: 'listItems'})
export class ListItem {
    @Prop({ required: true })
    type:
        'list' |
        'text' |
        'checklist' |
        'location' |
        'playlist' |
        'sketchboard';
    @Prop()
    title: string;

    //optional properties
    @Prop()
    text: string;
}

export const ListItemSchema = SchemaFactory.createForClass(ListItem);
