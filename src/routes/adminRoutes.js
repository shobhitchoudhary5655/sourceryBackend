const express = require('express');

const router = express.Router();

const {
  createEmployee,
  getEmployees,
} = require('../controllers/adminController');

router.post(
  '/create-employee',
  createEmployee
);

router.get(
  '/employees',
  getEmployees
);

module.exports = router;
