import User from "../models/User";
import EmployeeDocument from "../models/Document";

class AdminDao {

    public async getEmployeeDocuments(userId: number) {

        const employee = await User.findByPk(userId, {
            attributes: [
                "id",
                "employeeId",
                "name",
                "email",
                "designation",
            ],
        });

        if (!employee) {
            throw new Error("Employee not found.");
        }

        const documents = await EmployeeDocument.findAll({
            where: {
                userId,
            },
            attributes: [
                "id",
                "documentType",
                "documentName",
                "documentUrl",
                "mimeType",
                "fileSize",
                "status",
                "remarks",
            ],
            order: [["documentType", "ASC"]],
        });

        return {
            employee,
            documents,
        };
    }
}
export default new AdminDao();