import { Request, Response } from 'express';
import roleService from '../services/role.service';

class RoleController {

  public getRoles = async (req: Request, res: Response) => {
    try {
      const result = await roleService.getRoles();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

}

export default new RoleController();

// const roleDAO = require('../daos/role.dao');

// const getRoles = async (req,res) => {
//     try {
//         const roles = await roleDAO.getRoles()
//         res.status(200).json({success:true, roles})
//     } catch(error){
//         res.status(500).json({success:false,message:error.message})
//     }
// }

// module.exports = {
//     getRoles,
// }