import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
// import { JwtPayload } from './jwt-payload.interface'
import { InjectModel } from 'nestjs-typegoose'
import { User } from '../users/user.model'
import { ModelType } from 'typegoose'
import { ConfigService } from '../config/config.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User) private readonly userModel: ModelType<User>,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET'),
    })
  }

  async validate(payload: any): Promise<User | null> {
    const { username } = payload
    const user = await this.userModel.findOne({
      username
    }).populate({
      path: "favorites",
      model: "Post"
    })
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}