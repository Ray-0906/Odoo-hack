import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axiosInstance from "../utils/axios";
import SoloLoading from "../components/SoloLoading";

// Validation Schema
const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .matches(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed")
    .required("Username is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Must contain uppercase, lowercase, and number")
    .required("Password is required"),
});

const Signup = () => {
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
      const response = await axiosInstance.post("/auth/register", data, {
        withCredentials: true,
      });

      const user = response.data?.user;

      if (user) {
        localStorage.setItem("soloAuth", JSON.stringify(user));
        navigate("/dashboard"); // or homepage
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (err.message.includes("timeout")
          ? "Request timed out. Please try again."
          : "Signup failed.");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <SoloLoading loading={loading} message="Signing up..." />
      {!loading && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm bg-gray-800 p-6 rounded-xl shadow-md space-y-4"
        >
          <h2 className="text-center text-2xl font-bold text-cyan-400">Sign Up</h2>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-cyan-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              {...register("username")}
              className={`w-full mt-1 p-2 rounded bg-gray-700 border ${
                errors.username ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-cyan-400`}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-cyan-300">
              Email
            </label>
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
            <label htmlFor="password" className="block text-sm font-semibold text-cyan-300">
              Password
            </label>
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
            Sign Up
          </button>

          <div className="text-center text-sm text-gray-400 mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400 hover:underline">
              Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default Signup;
