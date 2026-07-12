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

    public viewProfilePicture = async (req: AuthRequest, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const result = await uploadService.viewProfilePicture(req.user.id);

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

    public uploadEmployeeDocument = async (req: AuthRequest, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Document is required.',
                });
            }

            const { documentType, documentName, } = req.body;

            if (!documentType || !documentName) {
                return res.status(400).json({
                    success: false,
                    message: 'Document type and document name are required.',
                });
            }

            const result = await uploadService.uploadEmployeeDocument(
                req.user.id,
                req.file,
                documentType,
                documentName,
            );

            return res.status(200).json(result);

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }

    };

    public getEmployeeDocuments = async (req: AuthRequest, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const result = await uploadService.getEmployeeDocuments(req.user.id,);

            return res.status(200).json(result);

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }

    };

    public deleteEmployeeDocument = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;

            await uploadService.deleteEmployeeDocument(Number(id),);

            return res.status(200).json({
                success: true,
                message: 'Document deleted successfully.',
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

    public viewEmployeeDocument = async (req: AuthRequest, res: Response) => {
        try {

            const { id } = req.params;

            const result = await uploadService.viewEmployeeDocument(
                Number(id)
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