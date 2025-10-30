"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword, AuthError } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { handleGoogleSignIn } from "@/lib/authService";

// Map Firebase Auth error codes to user-friendly messages
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isEmailLoginLoading, setIsEmailLoginLoading] = useState(false);
  const [isGoogleLoginLoading, setIsGoogleLoginLoading] = useState(false);
  const router = useRouter();

  // Clear error when inputs change
  useEffect(() => {
    if (error) setError(null);
  }, [email, password, error]);

  const isSubmitting = isEmailLoginLoading || isGoogleLoginLoading;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsEmailLoginLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      const authError = err as AuthError;
      setError(getErrorMessage(authError.code));
    } finally {
      setIsEmailLoginLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isSubmitting) return;

    setIsGoogleLoginLoading(true);
    setError(null);

    try {
      await handleGoogleSignIn(router);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Google sign-in failed. Please try again."
      );
    } finally {
      setIsGoogleLoginLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-white p-8 shadow-sm w-full max-w-md">
      <div className="text-left">
        <h1 className="text-3xl font-semibold text-gray-900">Login</h1>
        <p className="mt-1 text-gray-500">Please enter your details</p>
      </div>

      <form onSubmit={handleEmailLogin} className="mt-8 space-y-6" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-75"
            placeholder="you@example.com"
            aria-describedby={error ? "login-error" : undefined}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-75"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div id="login-error" role="alert" className="text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Create account
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full justify-center rounded-md border border-transparent bg-blue-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isEmailLoginLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">or continue with</span>
        </div>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={isSubmitting}
        className="w-full flex justify-center items-center gap-2 rounded-md border border-gray-300 bg-white py-3 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Sign in with Google"
      >
        <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
        {isGoogleLoginLoading ? "Signing in..." : "Continue with Google"}
      </button>
    </div>
  );
}
