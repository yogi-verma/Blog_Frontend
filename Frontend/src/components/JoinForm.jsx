import { useState } from "react";
import { submitUserRequest, verifyUserOtp } from "../utils/userRequestApi";
import toast, { Toaster } from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";

const JoinForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    reason: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      reason: "",
    });
    setOtp("");
    setOtpSent(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetVerify = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.fullName || !formData.reason) {
      toast.error("Please fill all fields before verifying", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    setLoadingVerify(true);

    try {
      const res = await submitUserRequest(formData);

      if (res.message) {
        toast.success("OTP sent to your email", {
          duration: 3000,
          position: "top-right",
          style: {
            backgroundColor: "#dcfce7",
            color: "#166534",
          },
        });
        setOtpSent(true);
      } else if (res.error && res.error.includes("already exists")) {
        toast.error("This email already exists, Try using another Mail", {
          duration: 3000,
          position: "top-right",
          style: {
            backgroundColor: "#fee2e2",
            color: "#991b1b",
          },
        });
      } else {
        toast.error(res.error || "Failed to send OTP", {
          duration: 3000,
          position: "top-right",
          style: {
            backgroundColor: "#fee2e2",
            color: "#991b1b",
          },
        });
      }
    } catch (error) {
      toast.error("An error occurred while processing your request", {
        duration: 3000,
        position: "top-right",
        style: {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
        },
      });
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP", {
        duration: 3000,
        position: "top-right",
        style: {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
        },
      });
      return;
    }

    setLoadingSubmit(true);

    try {
      const res = await verifyUserOtp({ email: formData.email, otp });

      if (res.message) {
        toast.success("Email has been verified. Admin will contact you soon!", {
          duration: 3000,
          position: "top-right",
          style: {
            backgroundColor: "#dcfce7",
            color: "#166534",
          },
        });
        setSubmitted(true);
        resetForm();
      } else {
        toast.error(res.error || "Verification failed", {
          duration: 3000,
          position: "top-right",
          style: {
            backgroundColor: "#fee2e2",
            color: "#991b1b",
          },
        });
      }
    } catch (error) {
      toast.error("An error occurred during verification", {
        duration: 3000,
        position: "top-right",
        style: {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
        },
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#3b82f6] px-4 py-8">
      <Toaster />
      <div className="bg-white shadow-xl rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="text-blue-600 hover:underline text-xs font-medium flex items-center"
          >
            <span className="mr-1">⬅</span> Back to Home
          </Link>
        </div>

        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Users!</h1>
          <p className="text-xs text-gray-600 mt-1">
            We're excited to have you here — join our community!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
            required
          />

          <textarea
            name="reason"
            placeholder="Why do you want to join?"
            value={formData.reason}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
            required
          ></textarea>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
            />
            <button
              type="button"
              onClick={handleGetVerify}
              disabled={loadingVerify}
              className="flex items-center justify-center gap-1 bg-gradient-to-br hover:cursor-pointer from-[#0f172a] via-[#1e3a8a] to-[#3b82f6] text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
            >
              {loadingVerify ? (
                <FaSpinner className="animate-spin" size={14} />
              ) : null}
              Get Verify
            </button>
          </div>

          <button
            type="submit"
            disabled={loadingSubmit || !otpSent}
            className={`w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:cursor-pointer text-white py-2 rounded-md text-sm font-medium hover:scale-[1.01] transition flex items-center justify-center ${
              !otpSent ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loadingSubmit && <FaSpinner className="animate-spin mr-1" size={14} />}
            Submit
          </button>
        </form>

        {submitted && (
          <p className="mt-4 text-center text-green-600 text-sm font-medium">
            🎉 Welcome to our community! Admin will contact you soon via mail!
          </p>
        )}
      </div>
    </div>
  );
};

export default JoinForm;