const express = require("express");
const  { createRequest, verifyOtp, getAllUsers }  = require("./userRequestController");

const router = express.Router();

router.post("/join", createRequest);
router.post("/verify", verifyOtp);
router.get("/all-users", getAllUsers);

module.exports = router;