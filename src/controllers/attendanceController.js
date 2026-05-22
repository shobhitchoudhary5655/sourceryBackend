const { Attendance, User, } = require('../models');


exports.getAttendance =
    async (req, res) => {
        try {

            const attendance =
                await Attendance.findAll({
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
                    order: [
                        ['date', 'DESC'],
                    ],
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


exports.punchIn = async (
    req,
    res
) => {
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
                message:
                    'Already Punched In Today',
            });
        }

        const attendance =
            await Attendance.create({
                userId,
                date: today,
                checkIn: new Date(),
                status: 'present',
            });

        res.status(201).json({
            success: true,
            message:
                'Punch In Successful',
            attendance,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.punchOut = async (
  req,
  res
) => {
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
        message:
          'Please Punch In First',
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message:
          'Already Punched Out',
      });
    }

    const checkOutTime =
      new Date();

    const workingHours =
      (
        (checkOutTime -
          new Date(
            attendance.checkIn
          )) /
        (1000 * 60 * 60)
      ).toFixed(2);

    attendance.checkOut =
      checkOutTime;

    attendance.workingHours =
      workingHours;

    const punchOutHour =
      checkOutTime.getHours();

    if (punchOutHour < 14) {

      attendance.status =
        'halfday';

    } else {

      attendance.status =
        'present';
    }

    await attendance.save();

    res.status(200).json({
      success: true,
      message:
        'Punch Out Successful',
      attendance,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyAttendance =
    async (req, res) => {
        try {

            const userId = req.user.id;

            const attendance =
                await Attendance.findAll({
                    where: { userId },
                    order: [
                        ['date', 'DESC'],
                    ],
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