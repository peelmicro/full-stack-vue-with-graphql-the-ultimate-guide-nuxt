import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from './user.model'
import { UsersService } from './users.service'
import { UsersResolver } from "./users.resolver"
import { ConfigService } from '../config/config.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    TypegooseModule.forFeature([User]),
    AuthModule
  ],
  providers: [UsersService, UsersResolver, ConfigService]
})
export class UsersModule { }
