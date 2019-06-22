import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from './model/user.model';
import { UsersService } from './users.service';
import { UsersResolver } from "./graphql/users.resolver";

@Module({
  imports: [TypegooseModule.forFeature([User])],
  providers: [UsersService, UsersResolver]
})
export class UsersModule { }
