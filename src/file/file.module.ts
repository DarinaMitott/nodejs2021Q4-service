import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterModule } from "@nestjs/platform-express";
import {  } from "@nestjs/platform-fastify";
import { File } from '../entities/file';
import { FileController } from "./file.controller";
import { FileService } from "./file.service";
import { UPLOADS_FOLDER } from "../common/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    MulterModule.register({
      dest: UPLOADS_FOLDER
    })
  ],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule {}
