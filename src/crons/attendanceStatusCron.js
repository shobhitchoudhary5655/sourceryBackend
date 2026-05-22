const cron = require('node-cron');

const {
  Attendance,
  User,
} = require('../models');

const attendanceStatusCron =
  () => {

    cron.schedule(
      '0 16 * * *',
      async () => {

        try {

          console.log(
            'Running Attendance Status Cron'
          );

          const today =
            new Date()
              .toISOString()
              .split('T')[0];

          const users =
            await User.findAll();

          for (const user of users) {

            const attendance =
              await Attendance.findOne({
                where: {
                  userId: user.id,
                  date: today,
                },
              });

            if (!attendance) {

              await Attendance.create({
                userId: user.id,
                date: today,
                status: 'leave',
              });
            }
          }

          console.log(
            'Attendance Status Updated'
          );

        } catch (error) {

          console.log(error);
        }
      },
      {
        timezone:
          'Asia/Kolkata',
      }
    );
  };

module.exports =
  attendanceStatusCron;