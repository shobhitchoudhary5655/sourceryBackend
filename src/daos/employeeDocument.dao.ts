import EmployeeDocument from "../models/Document";

class EmployeeDocumentDAO {

    public create = async (body: any) => {
        return EmployeeDocument.create(body);
    };

    public findById = async (id: number) => {
        return EmployeeDocument.findByPk(id);
    };

    public findByUserId = async (userId: number) => {
        return EmployeeDocument.findAll({
            where: {
                userId,
            },
            order: [
                ["createdAt", "DESC"],
            ],
        });

    };

    public findExistingDocument = async (userId: number, documentType: string, documentName: string,) => {
        return EmployeeDocument.findOne({
            where: {
                userId,
                documentType,
                documentName,
            },
        });

    };

    public update = async (id: number, body: any,) => {
        await EmployeeDocument.update(body, {
            where: {
                id,
            },
        });

        return this.findById(id);

    };

    public delete = async (id: number,) => {
        return EmployeeDocument.destroy({
            where: {
                id,
            },
        });

    };

}

export default new EmployeeDocumentDAO();