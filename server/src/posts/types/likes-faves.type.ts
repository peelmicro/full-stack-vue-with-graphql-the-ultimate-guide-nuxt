import { Field, ObjectType, Int } from 'type-graphql'
import { Ref } from 'typegoose'
import { Post } from '../post.model'

@ObjectType()
export class LikesFaves {
  @Field(() => Int)
  likes: number

  @Field(() => [Post], { nullable: "items" })
  readonly favorites: Ref<Post>[]
}
