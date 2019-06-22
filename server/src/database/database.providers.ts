import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
// import { MongooseModule } from '@nestjs/mongoose';
import { TypegooseModule } from 'nestjs-typegoose';

export const databaseProviders = [
  // MongooseModule.forRootAsync({
  //   imports: [ConfigModule],
  //   inject: [ConfigService],
  //   useFactory: async (config: ConfigService) => ({
  //     uri: config.get('MONGO_URI'),
  //     useNewUrlParser: true,
  //   }),
  // }),
  TypegooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      uri: config.get('MONGO_URI'),
      useNewUrlParser: true,
      useCreateIndex: true,
    }),
  }),
];

