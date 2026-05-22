const express = require('express');

const router = express.Router();

const authRoutes = require('./authRoutes');

const adminRoutes = require('./adminRoutes');

const hrRoutes = require('./hrRoutes');

const attendanceRoutes = require('./attendanceRoutes');

router.use('/auth', authRoutes);

router.use('/admin', adminRoutes);

router.use('/hr', hrRoutes);

router.use('/attendance', attendanceRoutes);


module.exports = router;