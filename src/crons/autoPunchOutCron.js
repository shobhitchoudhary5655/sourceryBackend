const cron = require('node-cron');

const { Attendance } =
  require('../models');

const autoPunchOutCron = () => {

  cron.schedule(
    '0 19 * * *',
    async () => {
      try {

        console.log(
          'Running Auto Punch Out Cron'
        );

        const today =
          new Date()
            .toISOString()
            .split('T')[0];

        const attendanceList =
          await Attendance.findAll({
            where: {
              date: today,
              checkOut: null,
            },
          });

        for (const attendance of attendanceList) {

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

          attendance.status =
            'auto-punch-out';

          await attendance.save();
        }

        console.log(
          'Auto Punch Out Completed'
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
  autoPunchOutCron;