import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from './model/user.model';
import { CreateUserDto } from './model/dtos/create-user.dto'
import { ModelType } from 'typegoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: ModelType<User>) { }

  async getUsers(): Promise<User[] | null> {
    return await this.userModel.find().exec();
  }
  async signupUserWithInput(createUserDto: CreateUserDto): Promise<User> {

    const username = createUserDto.username;
    const user = await this.userModel.findOne({ username });
    if (user) {
      throw new Error("User already exists");
    }
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async signupUser({ username, email, password }): Promise<User> {

    const user = await this.userModel.findOne({ username });
    if (user) {
      throw new Error("User already exists");
    }
    const createdUser = new this.userModel({ username, email, password });
    return await createdUser.save();
  }

}
