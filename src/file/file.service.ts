import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { File } from "../entities/file";

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>
  ) {}

  async findByName(filename: string): Promise<File|null> {
    return this.fileRepository.findOne({originalName: filename});
  }

  async create(originalName: string, uploadedName: string): Promise<File> {
    return this.fileRepository.save({
      originalName,
      uploadedName
    });
  }
}
