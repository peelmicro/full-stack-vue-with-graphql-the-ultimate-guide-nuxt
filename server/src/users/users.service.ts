import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { User } from './user.model'
import { ModelType } from 'typegoose'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: ModelType<User>) { }

  async getUsers(): Promise<User[] | null> {
    return await this.userModel.find().exec()
  }

}
