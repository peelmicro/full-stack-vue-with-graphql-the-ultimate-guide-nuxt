import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Post } from './model/post.model';
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


  async addPost(createPostDto: CreatePostDto): Promise<Post> {
    const newPost = new this.postModel(createPostDto);
    return await newPost.save();
  }
}
