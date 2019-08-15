import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UsersService } from './users.service'
import { User, Token } from './user.model'
import { GraphqlAuthGuard } from '../auth/graphql-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'
import { AuthService } from '../auth/auth.service'
import { UseGuards } from '@nestjs/common'

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @Query(() => User)
  @UseGuards(GraphqlAuthGuard)
  async getCurrentUser(@CurrentUser() currentUser: User) {
    return currentUser
  }

  @Query(() => [User])
  async getUsers() {
    return await this.usersService.getUsers()
  }

  @Mutation(() => Token)
  async signupUser(
    @Args('username') username: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return await this.authService.signUp({ username, email, password })
  }

  @Mutation(() => Token)
  async signinUser(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    return await this.authService.signIn({ username,  password })
  }
}