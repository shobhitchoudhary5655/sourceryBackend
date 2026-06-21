import { PutObjectCommand } from '@aws-sdk/client-s3';

import s3 from '../config/s3.config';

class S3Service {

  public uploadFile = async (
    file: Express.Multer.File
  ) => {

    const fileName =
      `${Date.now()}-${file.originalname}`;

    const command =
      new PutObjectCommand({
        Bucket:
          process.env.AWS_BUCKET_NAME as string,

        Key: fileName,

        Body: file.buffer,

        ContentType:
          file.mimetype,
      });

    await s3.send(command);

    return {
      fileName,

      fileUrl:
        `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
    };
  };

}

export default new S3Service();