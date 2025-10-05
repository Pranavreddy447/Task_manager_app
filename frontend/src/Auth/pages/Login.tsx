import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {login} from '../../api/auth'
import { useAuth } from '../../context/AuthContext';
import { EyeIcon, EyeOffIcon, Lock, LogIn, Mail } from "lucide-react";
import { loginSchema, type LoginValues } from "./schemas/LoginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setAuthState } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const handleLogin = async (data: LoginValues) => {
    await login(data.email, data.password).then((res) => {
      setAuthState({accessToken: res.access, refreshToken: res.refresh});
      navigate("/tasks");
    }).catch((err) => {
      toast.error(err.message || "Login failed");
    });
  };

  return (
    <div className="max-w-md mx-auto mt-[12%] flex flex-col items-center h-fit p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col justify-center items-center gap-1">
          <h2 className="text-4xl font-bold primary-text">Welcome Back</h2>
          <p className="text-gray-500 mb-6">Sign in to your Task Flow account</p>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit(handleLogin)}>

        <div className="flex flex-col">
          <div className="flex items-center border-b border-gray-300 py-2 w-full">
            <Mail className="text-gray-500 mr-3" width={20} height={20} />
            <input
              type="email"
              className="border-0 focus:outline-none w-full"
              placeholder="Enter your email"
              {...register("email")}
            />
          </div>
          {errors.email && <small className="text-red-600">{errors.email.message}</small>}
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-300 py-2 w-full">
            <div className="flex items-center">
              <Lock className="text-gray-500 mr-3" width={20} height={20} />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="border-0 focus:outline-none"
                placeholder="Enter your password"
              />
            </div>

            <div>
              {showPassword ? (
                <EyeIcon className="text-gray-500 cursor-pointer" width={20} height={20} onClick={() => setShowPassword(false)} />
              ) : (
                <EyeOffIcon className="text-gray-500 cursor-pointer" width={20} height={20} onClick={() => setShowPassword(true)} />
              )}
            </div>
          </div>
          {errors.password && <small className="text-red-600">{errors.password.message}</small>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center justify-center gap-3 w-full mt-6 primary-color text-white py-2 px-4 rounded transition-opacity
            ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
        >
          <LogIn className="inline-block text-white" width={20} height={20} />
          Login
        </button>

        <div className="flex items-center justify-center mt-4">
          <p className="text-gray-600">Don't have an account? <span onClick={() => navigate("/register")} className="primary-text font-bold cursor-pointer">Sign up</span></p>
        </div>
      </form>
    </div>
  );
};

export default Login;