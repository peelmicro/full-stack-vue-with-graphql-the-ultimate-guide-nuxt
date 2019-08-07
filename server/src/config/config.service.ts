import * as dotenv from 'dotenv'
import * as fs from 'fs'

export class ConfigService {
  MONGODB_URI: string
  private readonly envConfig: { [key: string]: string }

  constructor() {
    if (
      process.env.NODE_ENV === 'production' ||
      process.env.NODE_ENV === 'staging'
    ) {
      this.envConfig = {
        MONGO_URI: process.env.MONGO_URI,
        SECRET: process.env.SECRET
      }
    } else {
      this.envConfig = dotenv.parse(fs.readFileSync('.env'))
    }
  }

  get(key: string): string {
    return this.envConfig[key]
  }
}