import { Field, ObjectType, ID, Int } from 'type-graphql';
import { User } from '../../../users/graphql/types/user.type'

@ObjectType()
class Message {
  @Field(() => ID)
  readonly _id: string  
  @Field()
  readonly messageBody: string;
  @Field()
  readonly messageDate: Date;
  @Field()
  readonly messageUser: string;
}

@ObjectType()
export class Post {
  @Field(() => ID)
  readonly _id: string
  @Field()
  readonly title: string;
  @Field()
  readonly imageUrl: string;
  @Field(() => [String], { nullable: "items" })
  readonly categories: string[];
  @Field()
  readonly description: string;
  @Field()
  readonly createdDate: Date
  @Field(() => Int, { nullable: true })
  likes: number;
  @Field(() => User)
  readonly createdBy: User
  @Field(() => [Message], { nullable: true })
  readonly messages: [Message]
}
