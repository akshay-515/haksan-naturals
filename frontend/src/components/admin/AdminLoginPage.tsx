import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../api/adminAuthApi";
import { useAuth } from "../../context/AuthContext";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await adminLogin({
        email,
        password,
      });

      login(response.token);

      navigate("/admin");
    } catch {
      setError("Invalid admin email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 px-6 py-10">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage Haksan Naturals.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
};

export { AdminLoginPage };