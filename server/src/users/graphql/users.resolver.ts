import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from '../users.service';
import { UserInput } from './inputs/user.input';
import { User } from './types/user.type';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Query(() => [User])
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @Mutation(() => User)
  async signupUserWithInput(@Args('input') input: UserInput) {
    return await this.usersService.signupUser(input);
  }
  @Mutation(() => User)
  async signupUser(
    @Args('username') username: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return await this.usersService.signupUser({ username, email, password });
  }

}