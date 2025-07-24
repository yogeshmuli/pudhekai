"use client";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { login } from "@app/thunk/auth.thunk";
import { useRouter } from "next/navigation";
import { FaGraduationCap, FaGoogle, FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import useForm from "@app/hooks/useForm";
import Link from "next/link";

type LoginFormValues = { email: string; password: string };

export default function Login() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading, error } = useAppSelector((state: any) => state.auth);

    const [showPassword, setShowPassword] = useState(false);

    // Validation function
    const validate = (name: keyof LoginFormValues, value: string, values: LoginFormValues): string | null => {
        debugger
        if (name === "email" && !value) return "Email is required";
        if (name === "password" && value.length < 6) return "Password too short";
        return null;
    };

    // Use custom hook
    const { values, errors, handleChange, setErrors, handleSubmit }: any = useForm<LoginFormValues>(
        { email: "", password: "" },
        validate
    );
    console.log("Login values:", errors);

    // Submit handler
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        // Validate all fields on submit
        let newErrors: Record<keyof LoginFormValues, string | null> = { email: null, password: null };
        (Object.keys(values) as Array<keyof LoginFormValues>).forEach((key) => {
            newErrors[key] = validate(key, values[key], values);
        });
        setErrors(newErrors);
        const hasError = Object.values(newErrors).some((e) => e);
        if (hasError) return;

        const resultAction = await dispatch(login({ username: values.email, password: values.password }));
        if ((login.fulfilled as any).match(resultAction)) {
            router.push("/home");
        }
    };

    return (
        <div id="login-container" className="min-h-screen flex items-center justify-center px-4 py-12">
            <div id="login-card" className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-8">
                <div id="login-header" className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-primary rounded-full p-3">
                            <FaGraduationCap className="text-white text-2xl" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to PudheKai Assessment Hub</p>
                </div>

                <div id="google-login-section" className="space-y-4">
                    <button id="google-login-btn" type="button" className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                        <FaGoogle className="text-red-500 mr-3" />
                        <span className="font-medium">Continue with Google</span>
                    </button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">or</span>
                        </div>
                    </div>
                </div>

                <form id="login-form" className="space-y-6" >
                    <div id="email-field">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaEnvelope className="text-gray-400" />
                            </div>
                            <input

                                id="email"
                                name="email"

                                className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 ${errors.email ? "focus:ring-red-500" : "focus:ring-primary"} focus:border-transparent`}
                                placeholder="Enter your email"
                                value={values.email}
                                onChange={e => handleChange("email", e.target.value)}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-2">{errors.email}</p>
                        )}
                    </div>

                    <div id="password-field">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                required
                                className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 ${errors.password ? "focus:ring-red-500" : "focus:ring-primary"} focus:border-transparent`}
                                placeholder="Enter your password"
                                value={values.password}
                                onChange={e => handleChange("password", e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <button
                                    type="button"
                                    id="toggle-password"
                                    className="text-gray-400 hover:text-gray-600"
                                    tabIndex={-1}
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </button>
                            </div>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-2">{errors.password}</p>
                        )}
                    </div>

                    <div id="login-options" className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
                        </div>
                        <div className="text-sm">
                            <span className="font-medium text-primary hover:text-blue-500 cursor-pointer">Forgot password?</span>
                        </div>
                    </div>

                    <div id="login-submit">
                        <button
                            type="button"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
                            disabled={loading}
                            onClick={() => handleSubmit(handleFormSubmit)}

                        >
                            <FaSignInAlt className="mr-2" />
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                </form>

                {/* <div id="signup-link" className="text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <span className="font-medium text-primary hover:text-blue-500 cursor-pointer">Sign up here</span>
                    </p>
                </div> */}
                {/* sign up link */}
                <Link href="/register" className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <span className="font-medium text-primary hover:text-blue-500 cursor-pointer">Sign up here</span>
                </Link>

                <div id="help-section" className="text-center pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Need help?</p>
                    <div className="flex justify-center space-x-4">
                        <span className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">Support</span>
                        <span className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">Privacy</span>
                        <span className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">Terms</span>
                    </div>
                </div>
            </div>
        </div>
    );
}