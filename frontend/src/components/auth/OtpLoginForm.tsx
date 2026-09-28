import { useState } from "react";
import { requestOtp, verifyOtp } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const OtpLoginForm = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmail(event.target.value);
  };

  const handleOtpChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOtp(event.target.value);
  };

  const handleRequestOtp = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await requestOtp({ email });

      setOtpSent(true);
      setMessage("OTP sent successfully.");
    } catch {
      setError("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await verifyOtp({
        email,
        otp,
      });

      login(response.token);
      setMessage("Login successful.");
    } catch {
      setError("Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  if (otpSent) {
    return (
      <form
        onSubmit={handleVerifyOtp}
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700"
          >
            Enter OTP
          </label>

          <input
            id="otp"
            type="text"
            value={otp}
            onChange={handleOtpChange}
            maxLength={6}
            inputMode="numeric"
            required
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
          />
        </div>

        {message && (
          <p className="text-sm text-green-600">
            {message}
          </p>
        )}

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-green-700 px-4 py-2 font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleRequestOtp}
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          required
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
          placeholder="you@example.com"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-green-700 px-4 py-2 font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>
    </form>
  );
};

export { OtpLoginForm };