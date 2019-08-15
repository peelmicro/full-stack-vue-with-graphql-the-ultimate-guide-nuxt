import { Field, ObjectType } from 'type-graphql'
import { Post } from '../post.model'

@ObjectType()
export class PostPage {
  @Field(() => [Post], { nullable: "items" })
  readonly posts: [Post]

  @Field(() => Boolean)
  hasMore: boolean
}
