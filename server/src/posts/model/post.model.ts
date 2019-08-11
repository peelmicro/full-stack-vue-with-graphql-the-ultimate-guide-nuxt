import * as mongoose from "mongoose";
import { prop, Typegoose } from 'typegoose';
import { IsString, IsDate, IsArray, IsInt } from 'class-validator';
import { User } from '../../users/model/user.model'

class Message {
  @IsString()
  @prop({ required: true })
  messageBody: string;

  @IsDate()
  @prop({ default: Date.now })
  messageDate: Date;

  @IsString()
  @prop({ required: true, ref: User })
  messageUser: mongoose.Schema.Types.ObjectId
}

export class Post extends Typegoose {
  @IsString()
  @prop({ required: true })
  title: string; 

  @IsString()
  @prop({ required: true })
  imageUrl: string;

  @IsString()
  @prop({ required: true })
  categories: string[];

  @IsString()
  @prop({ required: true })
  description: string;

  @IsDate()
  @prop({ default: Date.now })
  createdDate: Date

  @IsInt()
  @prop({ default: 0 })
  likes: number;

  @IsString()
  @prop({ required: true, ref: User })
  createdBy: mongoose.Schema.Types.ObjectId

  @IsArray()
  @prop({ ref: Message })
  messages: [Message]
}

