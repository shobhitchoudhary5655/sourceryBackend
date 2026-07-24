import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Role } from '../models';
import { LoginDTO } from '../dtos/auth.dto';
import { UserWithRole } from '../types/user.type';

class AuthService {

  public login = async (data: LoginDTO) => {

    const { email, password, fcmToken } = data;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name'],
        },
      ],
    }) as unknown as UserWithRole;

    if (!user) {
      return {
        success: false,
        message: 'Invalid Email',
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        success: false,
        message: 'Invalid Password',
      };
    }

    if (fcmToken) {
      const tokens = user.fcmTokens || [];
      if (!tokens.includes(fcmToken)) {
        tokens.push(fcmToken);
        await User.update(
          { fcmTokens: tokens, },
          { where: { id: user.id, }, },
        );
      }
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role.name,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '7d',
      }
    );

    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    };
  };
}

export default new AuthService();