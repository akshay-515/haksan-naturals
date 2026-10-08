import { useState } from "react";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
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
    const value = event.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
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

  const handleChangeEmail = () => {
    setOtpSent(false);
    setOtp("");
    setError("");
    setMessage("");
  };

  if (otpSent) {
    return (
      <form
        onSubmit={handleVerifyOtp}
        className="space-y-5"
      >
        {/* OTP information */}
        <div className="rounded-xl bg-green-50 p-4">
          <div className="flex items-start gap-3">
            <Mail
              size={20}
              className="mt-0.5 shrink-0 text-green-700"
              strokeWidth={1.8}
            />

            <div>
              <p className="text-sm font-medium text-green-900">
                Check your email
              </p>

              <p className="mt-1 break-all text-xs leading-5 text-green-800/70">
                We sent a 6-digit OTP to{" "}
                <span className="font-medium text-green-900">
                  {email}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* OTP */}
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
            autoComplete="one-time-code"
            required
            autoFocus
            placeholder="000000"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-xl font-semibold tracking-[0.35em] text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
          disabled={loading || otp.length !== 6}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShieldCheck size={18} />

          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          type="button"
          onClick={handleChangeEmail}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-700"
        >
          <ArrowLeft size={16} />
          Use a different email
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
          Email address
        </label>

        <div className="relative mt-2">
          <Mail
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Mail size={18} />

        {loading ? "Sending..." : "Send OTP"}
      </button>
    </form>
  );
};

export { OtpLoginForm };