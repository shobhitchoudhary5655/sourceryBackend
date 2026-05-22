const express = require('express');

const router = express.Router();

const authMiddleware =
  require('../middleware/authMiddleware');

const {
  punchIn,
  punchOut,
  getMyAttendance,
  getAttendance,
} = require('../controllers/attendanceController');

router.post(
  '/punch-in',
  authMiddleware,
  punchIn
);

router.post(
  '/punch-out',
  authMiddleware,
  punchOut
);

router.get(
  '/my-attendance',
  authMiddleware,
  getMyAttendance
);

router.get(
  '/',
  authMiddleware,
  getAttendance
);

module.exports = router;