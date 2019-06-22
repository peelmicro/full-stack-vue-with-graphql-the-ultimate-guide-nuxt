import { InputType, Field } from 'type-graphql';

@InputType()
export class PostInput {
  @Field()
  readonly title: string;
  @Field()
  readonly imageUrl: string;
  @Field(() => [String])
  readonly categories: [string];
  @Field()
  readonly description: string;
  @Field()
  readonly creatorId: string;

}