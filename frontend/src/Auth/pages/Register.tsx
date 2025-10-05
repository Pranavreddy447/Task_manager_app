import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, Lock, Mail, UserPlus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterValues } from "./schemas/RegisterSchema";
import { registration } from "../../api/auth";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
    mode: "all",
  });

  console.log(errors);
  

  const handleRegister = async (data: RegisterValues) => {
    try {
      await registration(data.email, data.password).then((res)=>{
        console.log(res);
      });
      // setAuthState({accessToken: res.access, refreshToken: res.refresh});
      navigate("/tasks");
    } catch (err) {
        console.log(err);
        
      console.error(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-[12%] flex flex-col items-center h-fit p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col justify-center items-center gap-1">
        <h2 className="text-4xl font-bold primary-text">Create an account</h2>
        <p className="text-gray-500 mb-6">Sign up for your Task Flow account</p>
      </div>

      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit(handleRegister)}>
        {/* Email */}
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

        {/* Confirm password */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-300 py-2 w-full">
            <div className="flex items-center">
              <Lock className="text-gray-500 mr-3" width={20} height={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="border-0 focus:outline-none"
                placeholder="Confirm your password"
              />
            </div>

            <div>
              {showConfirmPassword ? (
                <EyeIcon className="text-gray-500 cursor-pointer" width={20} height={20} onClick={() => setShowConfirmPassword(false)} />
              ) : (
                <EyeOffIcon className="text-gray-500 cursor-pointer" width={20} height={20} onClick={() => setShowConfirmPassword(true)} />
              )}
            </div>
          </div>
          {errors.confirmPassword && <small className="text-red-600">{errors.confirmPassword.message}</small>}
        </div>

        {/* Make this whole area the submit button by using a button element */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center justify-center gap-3 w-full mt-6 primary-color text-white py-2 px-4 rounded transition-opacity
            ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
        >
          <UserPlus className="inline-block text-white" width={20} height={20} />
          {isSubmitting ? "Registering…" : "Create account"}
        </button>

        <div className="flex items-center justify-center mt-4">
          {/* small fix: link to login page instead of register (if appropriate) */}
          <p className="text-gray-600">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="primary-text font-bold cursor-pointer">
              Sign in
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
