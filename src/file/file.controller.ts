import {
  BadRequestException, ConflictException,
  Controller,
  Get, Header, InternalServerErrorException,
  NotFoundException,
  Param,
  Post, Res, StreamableFile,
  UploadedFile, UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { join } from "path";
import { createReadStream, existsSync } from "fs";
import { readFile } from 'fs/promises';
import { FileInterceptor } from "@nestjs/platform-express";
import { File } from '../entities/file';
import { FilenameDto } from "./dto";
import { FileService } from "./file.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UPLOADS_FOLDER, USE_FASTIFY } from "../common/config";

@UseGuards(JwtAuthGuard)
@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file) {
    const name = file.originalname;
    if (!(/^[\w\d._-]+$/im).test(name)) {
      throw new BadRequestException({error: 'File name has bad characters'});
    }
    return this.fileService.create(file.originalname, file.filename)
      .then((fileObj: File) => ({ name: fileObj.originalName }))
      .catch(reason => {
        if (reason?.message.startsWith('duplicate key value')) {
          throw new ConflictException('file already uploaded')
        }
        throw new InternalServerErrorException('save failed');
      });
  }

  @Get('/:filename')
  @Header('Content-Type', 'application/octet-stream')
  async download(@Param() { filename }: FilenameDto, @Res() res) {
    const file = await this.fileService.findByName(filename);
    if (!file) {
      throw new NotFoundException({error: 'File not found'});
    }
    const path = join(UPLOADS_FOLDER, file.uploadedName);
    if (!existsSync(path)) {
      throw new NotFoundException({ error: 'File not found' });
    }

    if (USE_FASTIFY) {
      const buff = await readFile(path, { encoding: 'binary' });
      res.send(buff);
    } else {
      createReadStream(path, { encoding: 'binary' })
       .pipe(res);
    }
  }
}
