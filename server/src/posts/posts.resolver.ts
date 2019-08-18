import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Int, ID } from 'type-graphql';
import { PostsService } from './posts.service';
import { PostInput } from './inputs/post.input';
import { PostPage } from './types/post-page.type';
import { LikesFaves } from './types/likes-faves.type';
import { Post, Message } from './post.model';

@Resolver()
export class PostsResolver {
  constructor(private readonly postsService: PostsService) { }

  @Query(() => [Post])
  async getPosts() {
    return await this.postsService.getPosts();
  }

  @Query(() => [Post], { nullable: true })
  async getUserPosts(@Args({ name: 'userId', type: () => ID }) userId: string) {
    return await this.postsService.getUserPosts(userId);
  }

  @Query(() => Post)
  async getPost(@Args({ name: 'postId', type: () => ID }) postId: string) {
    return await this.postsService.getPost(postId);
  }

  @Query(() => [Post], { nullable: true })
  async searchPosts(@Args({ name: 'searchTerm', type: () => String, nullable: true }) searchTerm: string) {
    return await this.postsService.searchPosts(searchTerm);
  }

  @Query(() => PostPage)
  async infiniteScrollPosts(
    @Args({ name: 'pageNum', type: () => Int }) pageNum: number,
    @Args({ name: 'pageSize', type: () => Int }) pageSize: number
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
    @Args({ name: 'creatorId', type: () => ID }) creatorId: string,
  ) {
    const createdBy = creatorId;
    return await this.postsService.addPost({ title, imageUrl, categories, description, createdBy });
  }

  @Mutation(() => Post)
  async updateUserPost(
    @Args({ name: 'postId', type: () => ID }) postId: string,    
    @Args({ name: 'userId', type: () => ID }) userId: string,
    @Args('title') title: string,
    @Args('imageUrl') imageUrl: string,
    @Args({ name: 'categories', type: () => [String], nullable: "items" }) categories: string[],
    @Args('description') description: string,
  ) {
    return await this.postsService.updateUserPost({ postId, userId, title, imageUrl, categories, description });
  }

  @Mutation(() => Post)
  async deleteUserPost(
    @Args({ name: 'postId', type: () => ID }) postId: string,    
  ) {
    return await this.postsService.deleteUserPost( postId );
  }

  @Mutation(() => Message)
  async addPostMessage(
    @Args('messageBody') messageBody: string,
    @Args({ name: 'userId', type: () => ID }) userId: string,
    @Args({ name: 'postId', type: () => ID }) postId: string,
  ) {
    return await this.postsService.addPostMessage({ messageBody, userId, postId });
  }

  @Mutation(() => LikesFaves)
  async likePost(
    @Args({ name: 'postId', type: () => ID }) postId: string,
    @Args('username') username: string
  ) {
    return await this.postsService.likePost(postId, username);
  }

  @Mutation(() => LikesFaves)
  async unlikePost(
    @Args({ name: 'postId', type: () => ID }) postId: string,
    @Args('username') username: string
  ) {
    return await this.postsService.unlikePost(postId, username);
  }

}