const express = require("express")
const router = express.Router();

const payrollController = require("../controllers/payrollController.js")

router.get("/getsalaries", payrollController.getsalaries)