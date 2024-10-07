import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';
import * as fs from 'fs';

@Injectable()
export class S3Service {
  getS3Instance(accessKeyId: string, secretAccessKey: string, region: string): S3 {
    return new AWS.S3({
      accessKeyId,
      secretAccessKey,
      region,
    });
  }

  async uploadFileToS3(
    file: Express.Multer.File,
    bucketName: string,
    accessKeyId: string,
    secretAccessKey: string,
    region: string,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const s3 = this.getS3Instance(accessKeyId, secretAccessKey, region);
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
      Bucket: bucketName,
      Key: file.originalname,
      Body: fileStream,
    };

    return s3.upload(uploadParams).promise();
  }
}
