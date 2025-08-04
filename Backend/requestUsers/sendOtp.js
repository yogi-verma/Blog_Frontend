const nodemailer = require("nodemailer");

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"Daily Blogs Community Team" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: "🔐 Your One-Time Passcode for Community Access",
    html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Welcome to Our Community!</h1>
      </div>
      
      <!-- Content -->
      <div style="padding: 24px; background-color: #ffffff;">
        <p style="font-size: 16px; color: #4a5568; margin-bottom: 24px;">
          Hello there! 👋 Please use the following verification code to complete your registration:
        </p>
        
        <!-- OTP Box -->
        <div style="background: #f8fafc; border: 1px dashed #cbd5e0; border-radius: 6px; padding: 16px; text-align: center; margin: 20px 0;">
          <p style="font-size: 14px; color: #64748b; margin: 0 0 8px 0;">Your One-Time Passcode</p>
          <div style="font-size: 32px; font-weight: 700; letter-spacing: 2px; color: #1e293b; background: #f1f5f9; padding: 8px 16px; border-radius: 4px; display: inline-block;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #64748b; margin: 8px 0 0 0;">Expires in 10 minutes</p>
        </div>
        
        <p style="font-size: 14px; color: #64748b; margin-bottom: 24px;">
          For security reasons, please don't share this code with anyone. Our team will never ask for your verification code.
        </p>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 16px;">
          <p style="font-size: 12px; color: #64748b; margin: 0;">
            If you didn't request this code, please ignore this email or contact support if you have questions.
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="font-size: 12px; color: #64748b; margin: 0;">
          © ${new Date().getFullYear()} Daily Blogs Community Team. All rights reserved.
        </p>
      </div>
    </div>
  `,
  };

  await transporter.sendMail(mailOptions);
};

const sendConfirmationEmail = async (toEmail, fullName) => {
  const mailOptions = {
    from: `"Daily Blogs Community Team" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: "🎉 Welcome Aboard! Your Email Is Verified ✅",
    html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <!-- Header with celebration gradient -->
      <div style="background: linear-gradient(135deg, #4ade80, #22c55e); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 600;">Welcome to the Community!</h1>
        <p style="color: white; opacity: 0.9; margin: 8px 0 0; font-size: 16px;">Your email is now verified</p>
      </div>
      
      <!-- Content Area -->
      <div style="padding: 30px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px;">
          <div style="background-color: #dcfce7; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
            <span style="font-size: 36px;">✅</span>
          </div>
        </div>
        
        <h2 style="font-size: 20px; color: #1e293b; margin-bottom: 20px; text-align: center;">
          Hii ${fullName}, you're all set!
        </h2>
        
        <p style="font-size: 16px; color: #4a5568; line-height: 1.6; margin-bottom: 20px; text-align: center;">
          Your email has been <strong style="color: #166534">successfully verified</strong> and you're now officially part of our community! We're thrilled to have you with us. <strong>Community Admin</strong> will share username and password with you soon.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 48px;">🎉</span>
        </div>
        
        <p style="font-size: 15px; color: #4a5568; line-height: 1.6; text-align: center;">
          Get ready to explore all the amazing features and connect with other members.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="font-size: 14px; color: #64748b; margin: 0 0 10px 0;">
          Need help? <a href="mailto:support@community.com" style="color: #3b82f6; text-decoration: none;">Contact our support team</a>
        </p>
        <p style="font-size: 12px; color: #94a3b8; margin: 0;">
          © ${new Date().getFullYear()} Daily Blogs Community Team. All rights reserved.
        </p>
      </div>
    </div>
  `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { generateOtp, sendOtpEmail, sendConfirmationEmail };
