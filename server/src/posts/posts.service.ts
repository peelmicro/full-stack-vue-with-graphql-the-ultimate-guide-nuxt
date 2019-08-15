import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Post, Message } from './post.model';
import { PostPage } from './types/post-page.type';
import { LikesFaves } from './types/likes-faves.type';
import { CreatePostDto } from './dtos/create-post.dto'
import { CreatePostMessageDto } from './dtos/create-post-message.dto'
import { ModelType, Ref } from 'typegoose';
import { User } from '../users/user.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private readonly postModel: ModelType<Post>,
    @InjectModel(User) private readonly userModel: ModelType<User>
  ) { }

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

  async likePost(postId: string, username: string): Promise<LikesFaves> {
    const post = await this.postModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { likes: 1 } },
      { new: true }
    );
    // Find User, add id of post to its favorites array (which will be populated as Posts)
    const user = await this.userModel.findOneAndUpdate(
      { username },
      { $addToSet: { favorites: postId } },
      { new: true }
    ).populate({
      path: "favorites",
      model: "Post"
    });
    // Return only likes from 'post' and favorites from 'user'
    const likesFaves: LikesFaves = {
      likes: post.likes,
      favorites: user.favorites
    }    
    return likesFaves;
  }

  async unlikePost(postId: string, username: string): Promise<LikesFaves> {
      // Find Post, add -1 to its 'like' value
      const post = await this.postModel.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: -1 } },
        { new: true }
      );
      // Find User, remove id of post from its favorites array (which will be populated as Posts)
      const user = await this.userModel.findOneAndUpdate(
        { username },
        { $pull: { favorites: postId } },
        { new: true }
      ).populate({
        path: "favorites",
        model: "Post"
      });
    // Return only likes from 'post' and favorites from 'user'
    const likesFaves: LikesFaves = {
      likes: post.likes,
      favorites: user.favorites
    }    
    return likesFaves;
  }  
}
