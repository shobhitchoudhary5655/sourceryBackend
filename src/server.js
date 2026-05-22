require('dotenv').config();

const app = require('./app');

const sequelize = require('./config/db');

const PORT = process.env.PORT || 5001;

const autoPunchOutCron =
  require('./crons/autoPunchOutCron');

const attendanceStatusCron =
  require('./crons/attendanceStatusCron');

sequelize
  .sync()
  .then(() => {
    console.log(
      '✅ MySQL Connected Successfully'
    );

    app.listen(PORT, () => {
      console.log(
        `🚀 Server Running On Port ${PORT}`
      );
    });

    autoPunchOutCron();

    attendanceStatusCron();
  })
  .catch(error => {
    console.log(error);
  });