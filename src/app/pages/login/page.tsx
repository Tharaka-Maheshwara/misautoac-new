"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, signInWithGoogle, createUserDocument } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  getAdditionalUserInfo,
} from "firebase/auth";
import GoogleIcon from "@/components/icons/GoogleIcon";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push("/"); // Redirect to home on success
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
      console.error("Login Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const result = await signInWithGoogle();
      const additionalInfo = getAdditionalUserInfo(result);
      if (additionalInfo?.isNewUser) {
        await createUserDocument(result.user);
      }
      router.push("/"); // Redirect to home on success
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Google Sign-In was cancelled.");
      } else {
        setError("Failed to sign in with Google. Please try again.");
      }
      console.error("Google Sign-In Error:", err);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
        <p className="mt-2 text-slate-600">Access your CoolDrive account</p>

        <div className="mt-8 space-y-5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white py-3 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            <GoogleIcon className="h-6 w-6" />
            <span>Sign in with Google</span>
          </button>

          <div className="flex items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="mx-4 text-sm font-medium text-slate-400">OR</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {error && (
            <div className="rounded-lg bg-red-100 p-3 text-center text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-3 px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-slate-700"
              >
                Password
              </label>
              <Link
                href="#"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-slate-50 py-3 px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
              >
                {/* Eye icons for show/hide password */}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-900 py-3 font-bold text-white shadow-lg transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-700">
          Don't have an account?{" "}
          <Link
            href="/pages/sign-up"
            className="font-semibold text-blue-600 hover:text-blue-500"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}