
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiClient } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const code = searchParams.get("code");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      setError(
        oauthError === "account_not_allowed"
          ? "This account cannot sign in through customer Google login."
          : "Google sign-in failed. Please try again."
      );
      return;
    }

    if (!code) {
      setError("The Google authorization code is missing.");
      return;
    }

    const exchangeCode = async () => {
      try {
        const response = await apiClient.post<{ token: string }>(
          "/api/auth/customer/google/exchange",
          { code }
        );

        login(response.data.token);

        // Remove the one-time code from the browser address bar.
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        navigate("/products", { replace: true });
      } catch {
        setError(
          "Google sign-in could not be completed. Please try again."
        );
      }
    };

    void exchangeCode();
  }, [searchParams, login, navigate]);

  if (error) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">
            Sign-in unsuccessful
          </h1>

          <p className="mt-3 text-sm text-gray-600">{error}</p>

          <Link
            to="/login"
            className="mt-6 inline-flex rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Back to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-700" />

        <h1 className="mt-5 text-lg font-semibold text-gray-900">
          Signing you in
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Please wait while we securely complete your Google sign-in.
        </p>
      </div>
    </main>
  );
};

export { GoogleCallbackPage };
