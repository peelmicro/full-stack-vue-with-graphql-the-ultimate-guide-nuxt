import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class UserInput {
  @Field()
  readonly username: string;
  @Field()
  readonly email: string;
  @Field()
  readonly password: string;

}