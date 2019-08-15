import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Post, Message } from './post.model';
import { PostPage } from './types/post-page.type';
import { CreatePostDto } from './dtos/create-post.dto'
import { CreatePostMessageDto } from './dtos/create-post-message.dto'
import { ModelType, Ref } from 'typegoose';

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

  async getPost(postId: string): Promise<Post | null> {
    const post = await this.postModel.findOne({ _id: postId })
      .populate({
        path: "messages.messageUser",
        model: "User"
      });
    return post;
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

  async addPostMessage(createPostMessageDto: CreatePostMessageDto): Promise<Ref<Message>> {
    const newMessage = {
      messageBody: createPostMessageDto.messageBody,
      messageUser: createPostMessageDto.userId
    };
    const post = await this.postModel.findOneAndUpdate(
      // find post by id
      { _id: createPostMessageDto.postId },
      // prepend (push) new message to beginning of messages array
      { $push: { messages: { $each: [newMessage], $position: 0 } } },
      // return fresh document after update
      { new: true }
    ).populate({
      path: "messages.messageUser",
      model: "User"
    });
    return post.messages[0];

  }
}
