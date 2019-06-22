import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  readonly _id: string
  @Field()
  readonly username: string;
  @Field()
  readonly email: string;
  @Field()
  readonly password: string;
  @Field({ nullable: true })
  readonly avatar: string;
  @Field()
  readonly joinDate: Date
  @Field(() => [ID], { nullable: true })
  readonly favourites: [string]
}
