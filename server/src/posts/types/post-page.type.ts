import { Field, ObjectType } from 'type-graphql'
import { Post } from '../post.model'
import { Ref } from 'typegoose'

@ObjectType()
export class PostPage {
  @Field(() => [Post], { nullable: "items" })
  readonly posts: Ref<Post>[]

  @Field(() => Boolean)
  hasMore: boolean
}
