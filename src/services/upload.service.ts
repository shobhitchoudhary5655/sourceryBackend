import s3Service from './s3.service';
import userDAO from '../daos/user.dao';

class UploadService {

  public uploadProfilePicture = async (userId: number,file: Express.Multer.File ) => {
    const uploadResult = await s3Service.uploadFile(file);

   await userDAO.updateProfileImage( userId, uploadResult.fileUrl);

    return {
      success: true,
      profilePicture:  uploadResult.fileUrl,
    };
  };

}

export default new UploadService();