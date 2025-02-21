import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import {MongooseModule} from '@nestjs/mongoose';
import { GroupModule } from './group/group.module';
import * as process from "node:process";
import * as dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}?authSource=admin`),
    UserModule,
    AuthModule,
    GroupModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
