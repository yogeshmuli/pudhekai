"use client";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { login } from "@app/thunk/auth.thunk";
import { useRouter } from "next/navigation";

export default function Login() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const resultAction = await dispatch(login({ username, password }));
        if (login.fulfilled.match(resultAction)) {
            router.push("/home");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-64">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border px-2 py-1 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border px-2 py-1 rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    );
}