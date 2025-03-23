import {forwardRef, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import {JwtModule} from "@nestjs/jwt";
import * as process from "node:process";
import * as dotenv from 'dotenv';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../user/user.schema";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

@Module({
    imports: [
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: {expiresIn: '30d'},
        }),
        forwardRef(() => UserModule),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {}
