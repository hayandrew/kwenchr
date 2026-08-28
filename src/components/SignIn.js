"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Overlay from "./Overlay";
import { showToast } from "./Toast";

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
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </div>
  );

  return (
    <Overlay title="Sign In" buttons={buttons}>
      <form
        onSubmit={handleLogin}
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
              Username or Email
            </label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="Enter your username or email"
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
              placeholder="Enter your password"
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
          Don&apos;t have an account?{" "}
          <Link
            href="/create-account"
            style={{ color: "var(--accent-gold)", fontWeight: "bold" }}
          >
            Create Account
          </Link>
        </div>
      </form>
    </Overlay>
  );
}
