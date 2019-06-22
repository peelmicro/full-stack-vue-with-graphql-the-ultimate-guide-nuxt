import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { GraphQLModule } from "@nestjs/graphql";
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    DatabaseModule,
    GraphQLModule.forRoot({
      autoSchemaFile: "schema.gql"
    }),
    UsersModule,
    PostsModule,
  ],
  providers: [AppService]
})
export class AppModule { }