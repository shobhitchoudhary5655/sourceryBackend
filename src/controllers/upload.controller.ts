import { Response } from 'express';
import uploadService from '../services/upload.service';
import { AuthRequest } from '../types/auth.types';

class UploadController {

    public uploadProfilePicture = async (req: AuthRequest, res: Response) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'File is required',
                });

            }
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const result = await uploadService.uploadProfilePicture(
                req.user.id,
                req.file as Express.Multer.File
            );

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }
    };
}

export default new UploadController();