import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostsService } from '../posts.service';
import { PostInput } from './inputs/post.input';
import { Post } from './types/post.type';

@Resolver()
export class PostsResolver {
  constructor(private readonly postsService: PostsService) { }

  @Query(() => [Post])
  async getPosts() {
    return await this.postsService.getPosts();
  }

  @Mutation(() => Post)
  async addPostWithInput(@Args('input') input: PostInput) {
    const createdBy = input.creatorId;
    const { title, imageUrl, categories, description } = input
    return await this.postsService.addPost({ title, imageUrl, categories, description, createdBy });
  }
  @Mutation(() => Post)
  async addPost(
    @Args('title') title: string,
    @Args('imageUrl') imageUrl: string,
    @Args({ name: 'categories', type: () => [String] }) categories: [string],
    @Args('description') description: string,
    @Args('creatorId') creatorId: string,
  ) {
    const createdBy = creatorId;
    return await this.postsService.addPost({ title, imageUrl, categories, description, createdBy });
  }

}