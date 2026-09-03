"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Overlay from "./Overlay";
import { showToast } from "./Toast";
import "./SignIn.css";

export default function SignIn() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      if (res.ok) {
        const user = await res.json();
        if (typeof window !== "undefined") {
          sessionStorage.setItem("kwenchr_user", JSON.stringify(user));
          // Dispatch a custom event to notify other components instantly of session login
          window.dispatchEvent(new Event("authChange"));
          showToast(`Welcome back, ${user.username}!`);
        }
        router.push("/");
        router.refresh();
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || "Authentication failed");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const buttons = (
    <div className="auth-buttons">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => router.push("/")}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="btn btn-primary"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </div>
  );

  return (
    <Overlay title="Sign In" buttons={buttons}>
      <form onSubmit={handleLogin} className="auth-form">
        {errorMsg && (
          <div className="auth-error-alert">
            {errorMsg}
          </div>
        )}

        <div className="auth-fields">
          <div>
            <label className="auth-label">
              Username or Email
            </label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="Enter your username or email"
              required
              className="auth-input"
            />
          </div>

          <div>
            <label className="auth-label">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="auth-input"
            />
          </div>
        </div>

        <div className="auth-switch-link">
          Don&apos;t have an account?{" "}
          <Link href="/create-account">
            Create Account
          </Link>
        </div>
      </form>
    </Overlay>
  );
}
