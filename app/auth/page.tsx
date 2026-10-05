"use client";

import React, { useState } from "react";
import { Eye, EyeOff, ChevronDown, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Books01Icon } from "@hugeicons/core-free-icons";
import { clearToken, LoginFunction, RegisterFunction } from "@/api/auth-api";
import { toast } from "sonner";
import { ACCESS, REFRESH } from "@/api/constants";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { GoogleAuthWrapper } from "@/components/GoogleAuthWrapper";

const getErrorMessage = (err: unknown): string => {
  if (!err) return "Something went wrong!";
  if (typeof err === "string") return err;
  if (typeof err !== "object") return "Something went wrong!";

  const data = err as Record<string, unknown>;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length) {
    return String(data.non_field_errors[0]);
  }
  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const val = data[firstKey];
    if (Array.isArray(val) && val.length) return String(val[0]);
    if (typeof val === "string") return val;
  }
  if (err instanceof Error && err.message) return err.message;
  return "Something went wrong!";
};

function AuthContent() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    gender: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const CreateAccount = async () => {
    setIsLoading(true);
    try {
      console.log(formData);
      await RegisterFunction(formData);
      toast.success("Account created successfully!");
    } catch (err: any) {
      console.log("error", err);
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Send the token to your Django endpoint
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}auth/google/`,
          {
            access_token: tokenResponse.access_token,
          },
        );

        // The response contains your JWTs
        console.log("Success:", response.data);
        clearToken();
        localStorage.setItem(ACCESS, response.data.access);
        window.location.href = "/dashboard";
      } catch (error) {
        console.error("Auth failed:", error);
      }
    },
    onError: (error) => console.log("Login Failed", error),
  });

  const LoginAccount = async () => {
    setIsLoading(true);
    try {
      const res = await LoginFunction(formData);
      toast.success("Login successful!");
      if (res?.access) localStorage.setItem(ACCESS, res.access);
      if (res?.refresh) localStorage.setItem(REFRESH, res.refresh);
      window.dispatchEvent(new Event("kora-auth-change"));
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.log("error", err);
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearToken();
    if (isSignUp) {
      CreateAccount();
    } else {
      LoginAccount();
    }
  };

  return (
    <div className="h-dvh w-full flex items-center justify-center p-4 md:p-8 overflow-hidden">
      <div className="w-full h-full max-h-full max-w-5xl rounded-3xl shadow-2xl overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row min-h-0">
        {/* Left Side Visual Banner */}
        <div className="flex-1 bg-gradient-to-br from-blue-600 via-primary to-sky-400 p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-900/20 rounded-full blur-2xl pointer-events-none" />

          {/* Logo / Header */}
          <Link href="/">
            <p className="flex items-center justify-center gap-3">
              <HugeiconsIcon icon={Books01Icon} />
              <span className="text-lg font-medium tracking-wider">Kora</span>
            </p>
          </Link>

          {/* Banner Text */}
          <div className="my-12 lg:my-0 z-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              {isSignUp ? "Start your Journey" : "Continue your Journey"}
            </h1>
            <p className="text-blue-100 text-sm max-w-sm leading-relaxed">
              {isSignUp
                ? "Follow these simple steps to set up your account and get started."
                : "Enter your credentials to access your account dashboard."}
            </p>
          </div>

          {/* Steps Indicator */}
          <div className="grid grid-cols-3 gap-3 z-10">
            <div className="bg-white text-gray-900 p-3.5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[100px]">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span className="text-xs font-semibold leading-tight">
                Register your account
              </span>
            </div>
            <div className="bg-white/15 backdrop-blur-md text-white p-3.5 rounded-2xl flex flex-col justify-between min-h-[100px] border border-white/10">
              <span className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span className="text-xs font-medium leading-tight opacity-80">
                Set up user Information
              </span>
            </div>
            <div className="bg-white/15 backdrop-blur-md text-white p-3.5 rounded-2xl flex flex-col justify-between min-h-[100px] border border-white/10">
              <span className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span className="text-xs font-medium leading-tight opacity-80">
                Start Using
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-white min-h-0 lg:overflow-y-auto">
          <div className="max-w-md mx-auto w-full h-full flex flex-col justify-between">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
              {isSignUp ? "Join Us" : "Welcome Back"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="juliet@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all text-sm text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Gender Field (Sign Up Only) */}
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required={isSignUp}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all text-sm text-gray-900 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Select your gender
                      </option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all text-sm text-gray-900 placeholder-gray-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {isSignUp && (
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-tight">
                    At least 8 characters with numbers and symbols.
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-2"
              >
                {isLoading ? (
                  <div className="w-full h-full opacity-80 animate-spin flex items-center justify-center">
                    <LoaderCircle />
                  </div>
                ) : isSignUp ? (
                  "Continue"
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            {/* Toggle Switch */}
            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-600 font-semibold hover:underline focus:outline-none"
                >
                  {isSignUp ? "Log in" : "Sign up"}
                </button>
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-400">Or</span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              onClick={() => {
                googleLogin();
              }}
              type="button"
              className="w-full py-3 px-4 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2.5 focus:outline-none"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>
                {isSignUp ? "Sign up with Google" : "Log in with Google"}
              </span>
            </button>

            {/* Terms Disclaimer */}
            <p className="text-[11px] text-gray-400 text-center mt-6 leading-relaxed">
              By continuing you confirm that you carefully have read and agree
              to the{" "}
              <a href="#" className="underline hover:text-gray-600">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-gray-600">
                Terms of Service
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <GoogleAuthWrapper>
      <AuthContent />
    </GoogleAuthWrapper>
  );
}
