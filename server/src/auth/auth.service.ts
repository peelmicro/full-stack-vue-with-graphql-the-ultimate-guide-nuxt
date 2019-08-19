import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from 'typegoose'
import { JwtService } from '@nestjs/jwt'
import { SigninUserDto } from '../users/dtos/signin-user.dto'
import { CreateUserDto } from '../users/dtos/create-user.dto'
import { Token, User } from '../users/user.model'
import { JwtPayload } from './jwt-payload.interface'
import md5 from 'md5'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: ModelType<User>,
    private readonly jwtService: JwtService,
  ) { }

  async signUp(createUserDto: CreateUserDto): Promise<Token> {
    const username = createUserDto.username
    const user = await this.userModel.findOne({ username })
    if (user) {
      throw new ConflictException("User already exists")
    }
    const avatar = `http://gravatar.com/avatar/${md5(username)}?d=identicon`
    var salt = bcrypt.genSaltSync(10)
    var password = bcrypt.hashSync(createUserDto.password, salt)
    const currentUser = { ...createUserDto, avatar, password }
    const createdUser = new this.userModel(currentUser)
    try {
      const newUser = await createdUser.save()
      const token = this.getAccessToken(newUser)
      return token
    }
    catch (error) {
      throw new InternalServerErrorException()
    }

  }

  async signIn(signinUserDto: SigninUserDto): Promise<Token> {
    const { username, password } = signinUserDto
    const user = await this.userModel.findOne({ username })
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new UnauthorizedException("Invalid credentials")
    }
    const token = this.getAccessToken(user)
    return token
  }

  private async getAccessToken(user: User): Promise<Token> {
    const { username, email } = user
    const payload: JwtPayload = { username, email }
    const token = await this.jwtService.sign(payload)
    return { token }
  }
}
