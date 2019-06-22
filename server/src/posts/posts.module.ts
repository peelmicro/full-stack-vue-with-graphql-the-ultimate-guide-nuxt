import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose'
import { Post } from './model/post.model';
import { PostsService } from './posts.service';
import { PostsResolver } from './graphql/posts.resolver';

@Module({
  imports: [TypegooseModule.forFeature([Post])],
  providers: [PostsService, PostsResolver]
})
export class PostsModule { }