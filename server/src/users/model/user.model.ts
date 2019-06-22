import * as mongoose from "mongoose";
import { prop, Typegoose } from 'typegoose';
import { IsString, IsDate, IsArray } from 'class-validator';

export class User extends Typegoose {
  @IsString()
  @prop({ required: true, unique: true, trim: true })
  username: string;

  @IsString()
  @prop({ required: true, trim: true })
  email: string;

  @IsString()
  @prop({ required: true, trim: true })
  password: string;

  @IsString()
  avatar?: string;

  @IsDate()
  @prop({ default: Date.now })
  joinDate: Date

  @IsArray()
  @prop({ required: true, ref: "Post" })
  favourites: [mongoose.Schema.Types.ObjectId]
}

