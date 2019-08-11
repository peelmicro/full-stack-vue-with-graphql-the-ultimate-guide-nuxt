import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Int, ID } from 'type-graphql';
import { PostsService } from '../posts.service';
import { PostInput } from './inputs/post.input';
import { PostPage } from './types/post-page.type';
import { Post } from './types/post.type';

@Resolver()
export class PostsResolver {
  constructor(private readonly postsService: PostsService) { }

  @Query(() => [Post])
  async getPosts() {
    return await this.postsService.getPosts();
  }

  @Query(() => PostPage)
  async infiniteScrollPosts(
    @Args({ name: 'pageNum', type: () => Int}) pageNum: number,
    @Args({ name: 'pageSize', type: () => Int}) pageSize: number
  ) {
    return await this.postsService.infiniteScrollPosts(pageNum, pageSize);
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
    @Args({ name: 'categories', type: () => [String], nullable: "items" }) categories: string[],
    @Args('description') description: string,
    @Args({ name: 'creatorId', type: () => ID}) creatorId: string,
  ) {
    const createdBy = creatorId;
    return await this.postsService.addPost({ title, imageUrl, categories, description, createdBy });
  }

}