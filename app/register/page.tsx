"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("สมัครสมาชิกสำเร็จ!");
                setTimeout(() => {
                    router.push("/login");
                }, 1500);
            } else {
                setError(data.message || "Register failed");
            }
        } catch {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="name"
                        placeholder="Name"
                        required
                        className="w-full border p-2 rounded-lg"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full border p-2 rounded-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        required
                        className="w-full border p-2 rounded-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                    >
                        {loading ? "Creating..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-sm mt-4">
                    มีบัญชีแล้ว?{" "}
                    <span
                        onClick={() => router.push("/login")}
                        className="text-blue-500 cursor-pointer"
                    >
                        เข้าสู่ระบบ
                    </span>
                </p>
            </div>
        </div>
    );
}
