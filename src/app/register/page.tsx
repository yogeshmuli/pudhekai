"use client";
import React, { useState } from "react";
import { FaUserPlus, FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaCalendar, FaGraduationCap } from "react-icons/fa";
import useForm from "@app/hooks/useForm";
import Image from "next/image";

type RegisterFormValues = {
    firstname: string;
    lastname: string;
    email: string;
    dob: string;
    grade: string;
    password: string;
    terms: boolean;
};

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);

    const validate = (name: keyof RegisterFormValues, value: any, values: RegisterFormValues): string | null => {
        if (name === "firstname" && !value) return "First name is required";
        if (name === "lastname" && !value) return "Last name is required";
        if (name === "email" && !value) return "Email is required";
        if (name === "dob" && !value) return "Date of birth is required";
        if (name === "grade" && !value) return "Grade is required";
        if (name === "password" && value.length < 6) return "Password must be at least 6 characters";
        if (name === "terms" && !value) return "You must agree to the terms";
        return null;
    };

    const { values, errors, handleChange, handleSubmit, setErrors }: any = useForm<RegisterFormValues>(
        {
            firstname: "",
            lastname: "",
            email: "",
            dob: "",
            grade: "",
            password: "",
            terms: false,
        },
        validate
    );

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit((formValues: any) => {
            // Submit logic here
            console.log("Register form submitted", formValues);
        });
    };

    return (
        <div id="register-container" className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/10 to-primary/20">
            <div id="register-card" className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 space-y-8">
                <div id="register-header" className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-primary rounded-full p-3 flex items-center justify-center">
                            <div className="bg-white rounded-full p-1 flex items-center justify-center">
                                <Image
                                    src="/logo-icon.svg"
                                    alt="PudheKai Logo"
                                    width={28}
                                    height={28}
                                    className="h-7 w-7"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-600">Join PudheKai Assessment Hub</p>
                </div>

                <div id="google-register-section" className="space-y-4">
                    <button
                        id="google-register-btn"
                        type="button"
                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => console.log("Google register clicked")}
                    >
                        <FaGoogle className="text-red-500 mr-3" />
                        <span className="font-medium">Sign up with Google</span>
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

                <form id="register-form" className="space-y-6" onSubmit={handleFormSubmit} noValidate>
                    <div id="name-fields" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div id="firstname-field">
                            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="firstname"
                                    name="firstname"
                                    required
                                    className={`block w-full pl-10 pr-3 py-3 border ${errors.firstname ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 ${errors.firstname ? "focus:ring-red-500" : "focus:ring-primary"} focus:border-transparent`}
                                    placeholder="First name"
                                    value={values.firstname}
                                    onChange={e => handleChange("firstname", e.target.value)}
                                />
                            </div>
                            {errors.firstname && <p className="text-red-500 text-xs mt-2">{errors.firstname}</p>}
                        </div>
                        <div id="lastname-field">
                            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="lastname"
                                    name="lastname"
                                    required
                                    className={`block w-full pl-10 pr-3 py-3 border ${errors.lastname ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 ${errors.lastname ? "focus:ring-red-500" : "focus:ring-primary"} focus:border-transparent`}
                                    placeholder="Last name"
                                    value={values.lastname}
                                    onChange={e => handleChange("lastname", e.target.value)}
                                />
                            </div>
                            {errors.lastname && <p className="text-red-500 text-xs mt-2">{errors.lastname}</p>}
                        </div>
                    </div>

                    <div id="email-field">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaEnvelope className="text-gray-400" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 ${errors.email ? "focus:ring-red-500" : "focus:ring-primary"} focus:border-transparent`}
                                placeholder="Enter your email"
                                value={values.email}
                                onChange={e => handleChange("email", e.target.value)}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
                    </div>

                    <div id="dob-field">
                        <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaCalendar className="text-gray-400" />
                            </div>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                required
                                className={`block w-full pl-10 pr-3 py-3 border ${errors.dob ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 ${errors.dob ? "focus:ring-red-500" : "focus:ring-primary"} focus:border-transparent`}
                                value={values.dob}
                                onChange={e => handleChange("dob", e.target.value)}
                            />
                        </div>
                        {errors.dob && <p className="text-red-500 text-xs mt-2">{errors.dob}</p>}
                    </div>

                    <div id="grade-field">
                        <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">Current Grade</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaGraduationCap className="text-gray-400" />
                            </div>
                            <select
                                id="grade"
                                name="grade"
                                required
                                className={`block w-full pl-10 pr-3 py-3 border ${errors.grade ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 ${errors.grade ? "focus:ring-red-500" : "focus:ring-primary"} focus:border-transparent bg-white`}
                                value={values.grade}
                                onChange={e => handleChange("grade", e.target.value)}
                            >
                                <option value="">Select your grade</option>
                                <option value="grade-6">Grade 6</option>
                                <option value="grade-7">Grade 7</option>
                                <option value="grade-8">Grade 8</option>
                                <option value="grade-9">Grade 9</option>
                                <option value="grade-10">Grade 10</option>
                                <option value="grade-11">Grade 11</option>
                                <option value="grade-12">Grade 12</option>
                                <option value="undergraduate">Undergraduate</option>
                                <option value="postgraduate">Postgraduate</option>
                            </select>
                        </div>
                        {errors.grade && <p className="text-red-500 text-xs mt-2">{errors.grade}</p>}
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
                                placeholder="Create password"
                                value={values.password}
                                onChange={e => handleChange("password", e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-600"
                                    tabIndex={-1}
                                    onClick={() => setShowPassword(prev => !prev)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password}</p>}
                    </div>

                    <div id="terms-field" className="flex items-center">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className={`h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded`}
                            checked={values.terms}
                            onChange={e => handleChange("terms", e.target.checked)}
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                            I agree to the <span className="text-primary hover:text-primary/80 cursor-pointer">Terms of Service</span> and <span className="text-primary hover:text-primary/80 cursor-pointer">Privacy Policy</span>
                        </label>
                        {errors.terms && <p className="text-red-500 text-xs ml-2">{errors.terms}</p>}
                    </div>

                    <div id="register-submit">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-primary hover:from-primary/80 hover:to-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
                        >
                            <FaUserPlus className="mr-2" />
                            Create Account
                        </button>
                    </div>
                </form>

                <div id="login-link" className="text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <span className="font-medium text-primary hover:text-primary/80 cursor-pointer">Sign in here</span>
                    </p>
                </div>

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