import { Field, ObjectType } from 'type-graphql'
import { Post } from './post.type'

@ObjectType()
export class PostPage {
  @Field(() => [Post])
  readonly posts: [Post]

  @Field(() => Boolean)
  hasMore: boolean
}
