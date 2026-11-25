
import { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { adminLogin } from "../../api/adminAuthApi";
import { useAuth } from "../../context/AuthContext";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await adminLogin({
        email: email.trim(),
        password,
      });

      login(response.token);
      navigate("/admin");
    } catch {
      setError("Invalid admin email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f8f4] px-4 py-10 sm:px-6">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-green-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-lime-100/50 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xl shadow-green-950/5 lg:grid-cols-2">
        {/* Left Branding Panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-[#153d2a] p-10 text-white lg:flex xl:p-12">
          {/* Decorative Background */}
          <div className="pointer-events-none absolute -right-28 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-16 -top-12 h-56 w-56 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-green-700/30 blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                <Sprout size={27} className="text-green-200" />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-wide">
                  HAKSAN NATURALS
                </h1>
                <p className="mt-0.5 text-xs tracking-widest text-green-200">
                  NATURE IN EVERY FORM
                </p>
              </div>
            </div>

            <div className="mt-24">
              <span className="inline-flex items-center gap-2 rounded-full border border-green-300/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-green-100">
                <Leaf size={14} />
                Admin Workspace
              </span>

              <h2 className="mt-6 max-w-sm text-4xl font-bold leading-tight xl:text-5xl">
                Manage your business.
                <span className="mt-2 block text-green-300">
                  Naturally.
                </span>
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-7 text-green-100/75">
                Manage products, monitor orders and keep your Haksan
                Naturals store running smoothly from one place.
              </p>
            </div>
          </div>

          <div className="relative mt-16">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-400/15 text-green-200">
                <ShieldCheck size={21} />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Secure Admin Access
                </p>
                <p className="mt-1 text-xs text-green-100/60">
                  Restricted access for authorized administrators.
                </p>
              </div>
            </div>

            <p className="mt-8 text-xs text-green-100/40">
              © {new Date().getFullYear()} Haksan Naturals. All rights reserved.
            </p>
          </div>
        </section>

        {/* Right Login Panel */}
        <section className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 xl:px-16">
          {/* Mobile Branding */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-800 text-white">
              <Sprout size={24} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-wide text-gray-900">
                HAKSAN NATURALS
              </h1>
              <p className="text-[10px] font-medium tracking-widest text-green-700">
                ADMIN PORTAL
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-800">
              <LockKeyhole size={23} />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
              Administrator Access
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Sign in with your administrator credentials to continue.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <div className="mt-0.5 shrink-0">
                <ShieldCheck size={17} />
              </div>

              <p>{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  required
                  placeholder="admin@example.com"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 transition hover:text-green-700"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-green-800 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-900/10 transition hover:bg-green-900 hover:shadow-green-900/20 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-7 flex items-start gap-3 rounded-xl bg-gray-50 p-4">
            <ShieldCheck
              size={18}
              className="mt-0.5 shrink-0 text-green-700"
            />

            <p className="text-xs leading-5 text-gray-500">
              This area is restricted to authorized administrators.
              Your account credentials are required to access the
              management dashboard.
            </p>
          </div>

          {/* Back to Store */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-700"
            >
              <ArrowLeft size={16} />
              Back to Store
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export { AdminLoginPage };
