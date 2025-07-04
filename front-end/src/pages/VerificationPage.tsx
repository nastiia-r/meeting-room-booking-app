import React, { useState } from "react";
 import { login, register} from "../services/authService.ts"

export default function VerificationPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let data;
            if (isLogin) {
                data = await login(form.email, form.password);
                localStorage.setItem("token", data.token);
                window.location.href = "/home";
            } else {
                data = await register(form.name, form.email, form.password);
                window.location.href = "/home";
                setForm({ name: "", email: "", password: "" });
            }
        } catch (err: any) {
            console.log(err.message);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>{isLogin ? "Login" : "Register"}</h2>
                {!isLogin && (
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                )}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{isLogin ? "Login" : "Register"}</button>
                <div className="auth-form-change">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button type="button" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Register" : "Login"}
                    </button>
                </div>
            </form>
        </div>
    );
}
