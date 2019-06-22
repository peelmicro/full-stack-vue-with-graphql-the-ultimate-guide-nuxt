import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { GraphQLModule } from "@nestjs/graphql";
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    GraphQLModule.forRoot({
      autoSchemaFile: "schema.gql"
    }),
  ],
  providers: [AppService]
})
export class AppModule { }