"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Overlay from "@/components/Overlay";
import { showToast } from "@/components/Toast";
import "./SignUp.css";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username,
          password,
          passwordConf: confirmPassword,
        }),
      });

      if (res.ok) {
        const savedUser = await res.json();

        // Auto-sign in the user upon registration success
        if (typeof window !== "undefined") {
          sessionStorage.setItem("kwenchr_user", JSON.stringify(savedUser));
          window.dispatchEvent(new Event("authChange"));
          showToast("Account registered successfully!");
        }

        router.push("/");
        router.refresh();
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const buttons = (
    <div className="signup-buttons">
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
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </div>
  );

  return (
    <Overlay title="Create Account" buttons={buttons}>
      <form onSubmit={handleRegister} className="signup-form">
        {errorMsg && (
          <div className="signup-error-alert">
            {errorMsg}
          </div>
        )}

        <div className="signup-fields">
          <div>
            <label className="signup-label">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. bartender_pro"
              required
              className="signup-input"
            />
          </div>

          <div>
            <label className="signup-label">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@example.com"
              required
              className="signup-input"
            />
          </div>

          <div>
            <label className="signup-label">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters recommended"
              required
              className="signup-input"
            />
          </div>

          <div>
            <label className="signup-label">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              className="signup-input"
            />
          </div>
        </div>

        <div className="signup-switch-link">
          Already have an account?{" "}
          <Link href="/sign-in">
            Sign In
          </Link>
        </div>
      </form>
    </Overlay>
  );
}
