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
      const response = await axiosInstance.post("/auth/login", data, {
        withCredentials: true,
      });

      const user = response.data?.user;

      if (user) {
        localStorage.setItem("soloAuth", JSON.stringify(user));
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (err.message.includes("timeout") ? "Request timed out. Please try again." : "Login failed.");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 p-4">
      <SoloLoading loading={loading} message="Logging in..." />
      {!loading && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm bg-white border border-gray-200 p-6 rounded-xl shadow-md space-y-4"
        >
          <h2 className="text-center text-2xl font-bold text-blue-600">Login</h2>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              {...register("email")}
              className={`w-full mt-1 p-2 rounded bg-white border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              {...register("password")}
              className={`w-full mt-1 p-2 rounded bg-white border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 transition font-semibold text-white"
          >
            Login
          </button>

          <div className="text-center text-sm text-gray-500 mt-2">
            New user?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
