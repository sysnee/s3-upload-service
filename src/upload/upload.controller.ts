import {
    Controller,
    Post,
    UploadedFile,
    Body,
    UseInterceptors,
    BadRequestException,
    HttpException,
    Logger,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { S3Service } from './upload.service';
  import { diskStorage } from 'multer';
  import * as fs from 'fs';
  
  @Controller('upload')
  export class UploadController {
    constructor(private readonly s3Service: S3Service) {}
  
    @Post()
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads',
        }),
      }),
    )
    async uploadFile(
      @UploadedFile() file: Express.Multer.File,
      @Body('accessKeyId') accessKeyId: string,
      @Body('secretAccessKey') secretAccessKey: string,
      @Body('region') region: string,
      @Body('bucketName') bucketName: string,
      @Body('fileName') fileName: string,
    ) {
      if (!file) {
        Logger.error('File is missing')
        throw new HttpException('File is missing', 400);
      }
  
      if (!accessKeyId || !secretAccessKey || !region || !bucketName) {
        throw new BadRequestException('Missing AWS credentials or bucket name');
      }
  
      try {
        const result = await this.s3Service.uploadFileToS3(
          file,
          bucketName,
          accessKeyId,
          secretAccessKey,
          region,
          fileName
        );
  
        fs.unlinkSync(file.path);
  
        return {
          message: 'File uploaded successfully',
          url: result.Location,
        };
      } catch (error) {
        Logger.error(error)
        throw new BadRequestException(error.message);
      }
    }
  }
  