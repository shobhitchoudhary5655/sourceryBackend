const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const { User, Role } = require('../models');

exports.login = async (req, res) => {
  try {
    console.log(req.body);

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          attributes: ['id', 'name'],
        },
      ],
    });

    console.log(user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Email',
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log(isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Password',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.Role.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.Role.name,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};