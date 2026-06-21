import roleDAO from '../daos/role.dao';

class RoleService {

  public getRoles = async () => {
    const roles = await roleDAO.findAll();

    return {
      success: true,
      roles,
    };
  };

}

export default new RoleService();