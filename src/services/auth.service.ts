import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Role } from '../models';
import { LoginDTO } from '../dtos/auth.dto';
import { UserWithRole } from '../types/user.type';
import { v4 as uuid } from "uuid";
import redis from "../config/redis";
import mailService from "./mail.service";
import { ResetPasswordDTO } from "../dtos/auth.dto";

class AuthService {

  public login = async (data: LoginDTO) => {
    const { email, password, fcmToken, platform } = data;

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
      return { success: false, message: 'Invalid Email', };
    }

    if (platform === "web" && user.role.id !== 1) {
      return { success: false, message: "Only administrators can log in to the web portal." };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return { success: false, message: 'Invalid Password', };
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

  public async forgotPassword(email: string) {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return { success: false, message: "Email not registered", };
    }

    const token = uuid();

    await redis.set(`forgot-password:${token}`,
      user.id,
      {
        ex: 600,
      }
    );

    const resetLink = `${process.env.WEB_URL}/reset-password?token=${token}`;

    await mailService.sendForgotPasswordEmail(user.email, user.name, resetLink);
    return { success: true, message: "Password reset link sent successfully.", };
  }

  public async resetPassword(data: ResetPasswordDTO) {
    const { token, password } = data;
    const userId = await redis.get<number>(`forgot-password:${token}`);

    if (!userId) {
      return { success: false, message: "Invalid or expired reset link.", };
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return { success: false, message: "User not found.", };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update({ password: hashedPassword, });
    await redis.del(`forgot-password:${token}`);
    await mailService.sendPasswordChangedMail(user.email, user.name);

    return {
      success: true,
      message: "Password reset successfully.",
    };
  }
}

export default new AuthService();