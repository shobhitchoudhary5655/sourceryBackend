import { DeleteObjectCommand, PutObjectCommand, } from '@aws-sdk/client-s3';
import s3 from '../config/s3.config';
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
class S3Service {

  public uploadFile = async (file: Express.Multer.File, folder: string, fileName?: string,) => {

    const extension = file.originalname.split('.').pop();
    const finalFileName = fileName ?? `${Date.now()}.${extension}`;
    const key = `${folder}/${finalFileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3.send(command);

    return {
      fileName: finalFileName,
      filePath: key,
      fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    };
  };

  public deleteFile = async (filePath: string,) => {
    if (!filePath) {
      return;
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: filePath,
    });

    await s3.send(command);
  };

  public getSignedUrl = async (filePath: string) => {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: filePath,
    });

    return await getSignedUrl(s3, command, {
      expiresIn: 300,
    });
  };

}

export default new S3Service();