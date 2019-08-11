import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Post } from './model/post.model';
import { PostPage } from './graphql/types/post-page.type';
import { CreatePostDto } from './model/dtos/create-post.dto'
import { ModelType } from 'typegoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post) private readonly postModel: ModelType<Post>) { }

  async getPosts(): Promise<Post[] | null> {
    const posts = await this.postModel.find({})
      .sort({ createdDate: "desc" })
      .populate({
        path: "createdBy",
        model: "User"
      });
    return posts;
  }

  async infiniteScrollPosts(pageNum: number, pageSize: number): Promise<PostPage | null> {
    const skips = pageSize * (pageNum - 1)
    const posts = await this.postModel.find({})
      .sort({ createdDate: "desc" })
      .populate({
        path: "createdBy",
        model: "User"
      })
      .skip(skips)
      .limit(pageSize)
      .lean()
      const totalDocs = await this.postModel.countDocuments()
      const hasMore = totalDocs > pageSize * pageNum
      const postPage: PostPage = {
        posts,
        hasMore
      }
      return postPage
  }  

  async addPost(createPostDto: CreatePostDto): Promise<Post> {
    const newPost = new this.postModel(createPostDto);
    return await newPost.save();
  }
}
