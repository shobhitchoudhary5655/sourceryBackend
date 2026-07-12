import path from 'path';
import s3Service from './s3.service';
import userDAO from '../daos/user.dao';
import employeeDocumentDAO from '../daos/employeeDocument.dao';

class UploadService {

  public uploadProfilePicture = async (
    userId: number,
    file: Express.Multer.File
  ) => {
    const extension = path.extname(file.originalname);

    const user = await userDAO.findById(userId);

    if (user?.profileImage) {
      await s3Service.deleteFile(user.profileImage);
    }

    const uploadResult = await s3Service.uploadFile(
      file,
      `employees/profile/${userId}`,
      `profile${extension}`,
    );

    await userDAO.updateProfileImage(
      userId,
      uploadResult.filePath
    );

    return {
      success: true,
      message: 'Profile picture uploaded successfully.',
      profilePicture: uploadResult.filePath,
    };
  };

  public viewProfilePicture = async (userId: number) => {
    const user = await userDAO.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    if (!user.profileImage) {
      throw new Error("Profile picture not found.");
    }

    const url = await s3Service.getSignedUrl(user.profileImage);

    return {
      success: true,
      url,
    };
  };

  public uploadEmployeeDocument = async (userId: number, file: Express.Multer.File, documentType: string, documentName: string,) => {
    const extension = path.extname(file.originalname);
    const safeName = documentName
      .trim()
      .replace(/\s+/g, '_')
      .toLowerCase();

    const existingDocument = await employeeDocumentDAO.findExistingDocument(
      userId,
      documentType,
      documentName,
    );

    if (existingDocument && existingDocument.documentPath) {
      await s3Service.deleteFile(existingDocument.documentPath,);
    }

    const uploadResult = await s3Service.uploadFile(
      file,
      `employees/documents/${userId}`,
      `${safeName}${extension}`,
    );

    if (existingDocument) {
      const updated = await employeeDocumentDAO.update(
        existingDocument.id,
        {
          documentUrl: uploadResult.fileUrl,
          documentPath: uploadResult.filePath,
          mimeType: file.mimetype,
          fileSize: file.size,
          status: 'pending',
          remarks: null,
        },
      );

      return {
        success: true,
        message: 'Document updated successfully.',
        data: updated,
      };

    }

    const document = await employeeDocumentDAO.create({
      userId,
      documentType,
      documentName,
      documentUrl: uploadResult.fileUrl,
      documentPath: uploadResult.filePath,
      mimeType: file.mimetype,
      fileSize: file.size,
      status: 'pending',
    });

    return {
      success: true,
      message: 'Document uploaded successfully.',
      data: document,
    };
  };

  public getEmployeeDocuments = async (userId: number,) => {
    const documents = await employeeDocumentDAO.findByUserId(userId);

    return {
      success: true,
      data: documents,
    };
  };

  public deleteEmployeeDocument = async (id: number,) => {
    const document = await employeeDocumentDAO.findById(id);

    if (!document) {
      throw new Error('Document not found.',);
    }

    if (document.documentPath) {
      await s3Service.deleteFile(document.documentPath,);
    }

    await employeeDocumentDAO.delete(id);

    return {
      success: true,
      message: 'Document deleted successfully.',
    };

  };

  public viewEmployeeDocument = async (id: number) => {

    const document = await employeeDocumentDAO.findById(id);

    if (!document) {
      throw new Error("Document not found.");
    }

    const url = await s3Service.getSignedUrl(document.documentPath);

    return {
      success: true,
      url,
    };
  };

}

export default new UploadService();