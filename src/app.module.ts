import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WinstonModule } from 'nest-winston';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import config from './ormconfig';
import { loggingConfig } from "./logger";
import { FileModule } from './file/file.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(config),
    WinstonModule.forRoot(loggingConfig),
    UsersModule,
    BoardsModule,
    TasksModule,
    AuthModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
