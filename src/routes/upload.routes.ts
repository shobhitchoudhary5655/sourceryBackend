import { Router } from 'express';

import authMiddleware from '../middleware/authMiddleware';
import uploadMiddleware from '../middleware/upload.middleware';
import uploadController from '../controllers/upload.controller';

class UploadRoutes {

    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {

        this.router.post(
            '/profile-picture',
            authMiddleware.verifyToken,
            uploadMiddleware.upload.single('profilePicture'),
            uploadController.uploadProfilePicture,
        );

        this.router.get(
            "/profile-picture/view",
            authMiddleware.verifyToken,
            uploadController.viewProfilePicture
        );

        this.router.post(
            '/documents',
            authMiddleware.verifyToken,
            uploadMiddleware.upload.single('file'),
            uploadController.uploadEmployeeDocument,
        );

        this.router.get(
            '/documents',
            authMiddleware.verifyToken,
            uploadController.getEmployeeDocuments,
        );

        this.router.delete(
            '/documents/:id',
            authMiddleware.verifyToken,
            uploadController.deleteEmployeeDocument,
        );

        this.router.get(
            "/documents/:id/view",
            authMiddleware.verifyToken,
            uploadController.viewEmployeeDocument
        );

    }

}

export default new UploadRoutes().router;