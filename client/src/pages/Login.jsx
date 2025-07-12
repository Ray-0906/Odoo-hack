import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import axiosInstance from "../utils/axios";

import SoloLoading from "../components/SoloLoading";

// Validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.post("/auth/login", data, { timeout: 10000 });
      console.log("Login response:", response.data);
      navigate(response.data.redirectUrl || "/oauth-success");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (err.message.includes("timeout") ? "Request timed out. Please try again." : "Login failed.");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || "https://api.example.com";
    window.location.assign(`${serverUrl}/auth/google`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <SoloLoading loading={loading} message="Logging in..." />
      {!loading && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm bg-gray-800 p-6 rounded-xl shadow-md space-y-4"
        >
          <h2 className="text-center text-2xl font-bold text-cyan-400">Login</h2>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-cyan-300">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              {...register("email")}
              className={`w-full mt-1 p-2 rounded bg-gray-700 border ${
                errors.email ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-cyan-400`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-cyan-300">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              {...register("password")}
              className={`w-full mt-1 p-2 rounded bg-gray-700 border ${
                errors.password ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-cyan-400`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-cyan-500 hover:bg-cyan-600 transition font-semibold text-white"
          >
            Login
          </button>

          <div className="text-center text-sm text-gray-400">or</div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2 rounded bg-black/60 border border-gray-500 hover:bg-gray-700 transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.20-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="text-center text-sm text-gray-400">
            New user?{" "}
            <Link to="/signup" className="text-cyan-400 hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
