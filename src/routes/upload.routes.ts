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
            uploadController.uploadProfilePicture
        );
    }
}

export default new UploadRoutes().router;