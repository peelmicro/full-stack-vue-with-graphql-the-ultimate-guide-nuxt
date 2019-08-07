import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy'
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from '../users/model/user.model';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET'),
        signOptions: {
            expiresIn: 216000, // 1 Hour: 60 * 60 * 60
        },
      }),
    }),
    TypegooseModule.forFeature([User]),    

  ],
  providers: [
    JwtStrategy,
    AuthService,
    ConfigService
  ],
  exports: [
    AuthService
  ],
})
export class AuthModule {}