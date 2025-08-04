const UserRequest = require("./UserRequest");
const { generateOtp, sendOtpEmail,sendConfirmationEmail } = require("./sendOtp");

exports.createRequest = async (req, res) => {
  const { email, fullName, reason } = req.body;
  try {


     const existingUser = await UserRequest.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, try using another email." });
    }
    

    if (!email || !fullName || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Generate OTP and expiry
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Save to DB
    const newRequest = new UserRequest({
      email,
      fullName,
      reason,
      otp,
      otpExpiresAt,
      isVerified: false,
    });

    await newRequest.save();

    // Send OTP
    await sendOtpEmail(email, otp);

    res.status(201).json({ message: "OTP sent to your email for verification." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await UserRequest.findOne({ email }).sort({ createdAt: -1 });

  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.otp !== otp.toString()) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (new Date() > user.otpExpiresAt) {
    return res.status(400).json({ message: "OTP expired" });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

    await sendConfirmationEmail(user.email, user.fullName);


  res.status(200).json({ message: "Email verified successfully!" });
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserRequest.aggregate([
      {
        $group: {
          _id: "$email",
          doc: { $first: "$$ROOT" }  // Picks the first document per email
        }
      },
      {
        $replaceRoot: { newRoot: "$doc" }  // Flattens the doc back to top level
      }
    ]);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



