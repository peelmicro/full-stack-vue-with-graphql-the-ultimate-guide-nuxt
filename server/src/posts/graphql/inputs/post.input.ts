import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class PostInput {
  @Field()
  readonly title: string;
  @Field()
  readonly imageUrl: string;
  @Field(() => [String], { nullable: "items" })
  readonly categories: string[];
  @Field()
  readonly description: string;
  @Field(() => ID)
  readonly creatorId: string;

}