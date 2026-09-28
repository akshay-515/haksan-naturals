import { OtpLoginForm } from "../../components/auth/OtpLoginForm";

const LoginPage = () => {
  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">
          Login to Haksan Naturals
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Enter your email to receive a one-time password.
        </p>

        <div className="mt-6">
          <OtpLoginForm />
        </div>
      </div>
    </main>
  );
};

export { LoginPage };