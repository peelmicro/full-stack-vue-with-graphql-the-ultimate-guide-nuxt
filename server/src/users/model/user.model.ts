import * as mongoose from "mongoose"
import { prop, Typegoose } from 'typegoose'
import { IsString, IsDate, IsArray } from 'class-validator'


export class Token {
  @IsString()
  readonly token: string  
}

export class User extends Typegoose {
  @IsString()
  @prop({ required: true, unique: true, trim: true })
  username: string

  @IsString()
  @prop({ required: true, trim: true })
  email: string

  @IsString()
  @prop({ required: true, trim: true })
  password: string

  @IsString()
  @prop()
  avatar?: string

  @IsDate()
  @prop({ default: Date.now })
  joinDate: Date

  @IsArray()
  @prop({ required: true, ref: "Post" })
  favorites: [mongoose.Schema.Types.ObjectId]
}

