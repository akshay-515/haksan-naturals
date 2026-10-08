import { Link } from "react-router-dom";
import { Leaf, ShieldCheck } from "lucide-react";
import { OtpLoginForm } from "../../components/auth/OtpLoginForm";

const LoginPage = () => {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gradient-to-b from-green-50 via-white to-white px-4 py-12">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex flex-col items-center"
          >
            <img
              src="src/assets/haksan-logo-mark.png"
              alt="Haksan Naturals"
              className="h-16 w-16 object-contain"
            />

            <p className="mt-3 text-xl font-bold text-green-900">
              Haksan Naturals
            </p>

            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-green-700">
              Pure Goodness, Naturally
            </p>
          </Link>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Sign in to continue shopping with Haksan Naturals.
            </p>
          </div>

          <div className="mt-7">
            <OtpLoginForm />
          </div>

          {/* Security note */}
          <div className="mt-7 flex items-start gap-3 rounded-xl bg-green-50 p-4">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-green-700"
              strokeWidth={1.8}
            />

            <div>
              <p className="text-sm font-medium text-green-900">
                Secure sign in
              </p>

              <p className="mt-1 text-xs leading-5 text-green-800/70">
                We use a one-time password instead of asking you
                to remember another password.
              </p>
            </div>
          </div>
        </div>

        {/* Back to shopping */}
        <div className="mt-6 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-700"
          >
            <Leaf size={16} />
            Continue shopping
          </Link>
        </div>

      </div>
    </main>
  );
};

export { LoginPage };