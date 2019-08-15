import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose'
import { Post } from './post.model';
import { User } from '../users/user.model';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';

@Module({
  imports: [
    TypegooseModule.forFeature([User]),
    TypegooseModule.forFeature([Post])
  ],
  providers: [PostsService, PostsResolver]
})
export class PostsModule { }