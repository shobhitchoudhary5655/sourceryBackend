const { Attendance, User } = require('../models');

exports.getAttendance = async (req, res) => {
  try {

    const attendance = await Attendance.findAll({
      include: [
        {
          model: User,
          attributes: [
            'id',
            'name',
            'email',
            'designation',
          ],
        },
      ],
      order: [['date', 'DESC']],
    });

    res.status(200).json({
      success: true,
      attendance,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.punchIn = async (req, res) => {
  try {

    const userId = req.user.id;

    const today = new Date()
      .toISOString()
      .split('T')[0];

    const existingAttendance =
      await Attendance.findOne({
        where: {
          userId,
          date: today,
        },
      });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Already Punched In Today',
      });
    }

    const currentTime = new Date();

    const indianTime = new Date(
      currentTime.toLocaleString(
        'en-US',
        {
          timeZone: 'Asia/Kolkata',
        }
      )
    );

    const attendance =
      await Attendance.create({
        userId,
        date: today,
        checkIn: indianTime,
        status: 'present',
      });

    res.status(201).json({
      success: true,
      message: 'Punch In Successful',
      attendance,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.punchOut = async (req, res) => {
  try {

    const userId = req.user.id;

    const today = new Date()
      .toISOString()
      .split('T')[0];

    const attendance =
      await Attendance.findOne({
        where: {
          userId,
          date: today,
        },
      });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: 'Please Punch In First',
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Already Punched Out',
      });
    }

    const currentTime = new Date();

    const indianTime = new Date(
      currentTime.toLocaleString(
        'en-US',
        {
          timeZone: 'Asia/Kolkata',
        }
      )
    );

    const workingHours = (
      (
        indianTime -
        new Date(attendance.checkIn)
      ) / (1000 * 60 * 60)
    ).toFixed(2);

    attendance.checkOut = indianTime;

    attendance.workingHours = workingHours;

    const punchOutHour =
      indianTime.getHours();

    if (punchOutHour < 14) {

      attendance.status = 'halfday';

    } else {

      attendance.status = 'present';
    }

    await attendance.save();

    res.status(200).json({
      success: true,
      message: 'Punch Out Successful',
      attendance,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {

    const userId = req.user.id;

    const attendance =
      await Attendance.findAll({
        where: { userId },
        order: [['date', 'DESC']],
      });

    res.status(200).json({
      success: true,
      attendance,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};