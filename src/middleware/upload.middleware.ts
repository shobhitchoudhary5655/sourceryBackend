import multer from 'multer';

class UploadMiddleware {

  public upload = multer({
    storage: multer.memoryStorage(),

    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });

}

export default new UploadMiddleware();