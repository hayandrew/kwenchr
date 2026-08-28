"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Overlay from "./Overlay";
import { showToast } from "./Toast";

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
    <div style={{ display: "flex", gap: "10px" }}>
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
      <form
        onSubmit={handleRegister}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {errorMsg && (
          <div
            style={{
              background: "rgba(235, 87, 87, 0.1)",
              border: "1px solid #eb5757",
              borderRadius: "6px",
              color: "#eb5757",
              padding: "10px 14px",
              fontSize: "13px",
            }}
          >
            {errorMsg}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. bartender_pro"
              required
              style={{
                width: "100%",
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "6px",
                color: "white",
                padding: "10px 14px",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@example.com"
              required
              style={{
                width: "100%",
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "6px",
                color: "white",
                padding: "10px 14px",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters recommended"
              required
              style={{
                width: "100%",
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "6px",
                color: "white",
                padding: "10px 14px",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              style={{
                width: "100%",
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "6px",
                color: "white",
                padding: "10px 14px",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
        </div>

        <div
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/sign-in"
            style={{ color: "var(--accent-gold)", fontWeight: "bold" }}
          >
            Sign In
          </Link>
        </div>
      </form>
    </Overlay>
  );
}
