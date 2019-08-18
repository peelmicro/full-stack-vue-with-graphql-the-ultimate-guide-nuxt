import { prop, arrayProp, Typegoose, Ref, index } from 'typegoose';
import { IsDate, IsInt } from 'class-validator';
import { Field, ObjectType, ID, Int } from 'type-graphql';
import { User } from '../users/user.model'

@ObjectType()
export class Message extends Typegoose {
  @Field(() => ID)
  _id: string

  @Field()
  @prop({ required: true })
  messageBody: string;

  @IsDate()
  @Field()
  @prop({ default: Date.now })
  messageDate: Date;

  @Field(() => User)
  @prop({ required: true, ref: 'User' })
  messageUser: Ref<User>
}

// Create index to search on all fields of posts
@index({'$**': 'text'})
@ObjectType()
export class Post extends Typegoose {
  @Field(() => ID)
  _id: string

  @Field()
  @prop({ required: true })
  title: string; 

  @Field()
  @prop({ required: true })
  imageUrl: string;

  @Field(() => [String], { nullable: "items" })
  @prop({ required: true })
  categories: string[];

  @Field()
  @prop({ required: true })
  description: string;

  @IsDate()
  @Field()
  @prop({ default: Date.now })
  createdDate: Date

  @IsInt()
  @Field(() => Int, { nullable: true })
  @prop({ default: 0 })
  likes: number;

  @Field(() => User)
  @prop({ required: true, ref: 'User' })
  createdBy: Ref<User>

  @Field(() => [Message], { nullable: "itemsAndList" })
  @arrayProp({ items: Message })
  messages?: Ref<Message>[]
}

