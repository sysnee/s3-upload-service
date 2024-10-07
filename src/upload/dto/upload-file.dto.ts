import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  @IsString()
  accessKeyId: string;

  @IsNotEmpty()
  @IsString()
  secretAccessKey: string;

  @IsNotEmpty()
  @IsString()
  region: string;

  @IsNotEmpty()
  @IsString()
  bucketName: string;
}
