import { Field, ObjectType, ID } from 'type-graphql'
import { arrayProp, prop, Typegoose, Ref } from 'typegoose'
import { IsEmail, IsDate, IsArray } from 'class-validator'
import { Post } from '../posts/post.model'

@ObjectType()
export class Token {
  @Field()
  readonly token: string  
}

@ObjectType()
export class User extends Typegoose {
  @Field(() => ID)
  _id: string

  @Field()  
  @prop({ required: true, unique: true, trim: true })
  username: string

  @IsEmail()
  @Field()  
  @prop({ required: true, trim: true })
  email: string

  @Field()
  @prop({ required: true, trim: true })
  password: string

  @Field({ nullable: true })
  @prop()
  avatar?: string

  @IsDate()
  @Field()  
  @prop({ default: Date.now })
  joinDate: Date

  @IsArray()
  @Field(() => [Post], { nullable: "itemsAndList" })  
  @arrayProp({ itemsRef: Post })
  favorites?: Ref<Post>[]
}

