import { ConfigModule } from '../config/config.module'
import { ConfigService } from '../config/config.service'
import { TypegooseModule } from 'nestjs-typegoose'

export const databaseProviders = [
  TypegooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      uri: config.get('MONGO_URI'),
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify : false,
    }),
  }),
]

