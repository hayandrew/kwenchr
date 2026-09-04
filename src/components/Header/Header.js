"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ProfileDropdown from "@/components/ProfileDropdown";
import "./Header.css";

export default function Header() {
  const [user, setUser] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const mobileNavRef = useRef(null);

  const checkAuth = () => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("kwenchr_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen to authentication status updates across components
    window.addEventListener("authChange", checkAuth);
    return () => {
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(e.target)) {
        setMobileNavOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileNavOpen(false);
      }
    };

    if (mobileNavOpen) {
      document.addEventListener("click", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileNavOpen]);

  return (
    <header>
      {/* Clickable Logo linking to Home */}
      <Link href="/" className="logo">
        <div className="icon icon-kwenchr"></div>
      </Link>

      {/* <div className="column tagline">
        <h1>
          Get Your Drink On<span className="trademark">&trade;</span>
        </h1>
      </div> */}

      <div className="profile-info">
        {user ? (
          <ProfileDropdown />
        ) : (
          <>
            {/* Desktop Auth Links */}
            <div className="desktop-auth-links">
              <Link href="/sign-in" className="header-signin-link">
                Sign In
              </Link>
              <Link href="/create-account" className="header-signup-link">
                Create Account
              </Link>
            </div>

            {/* Mobile Navigation */}
            <div className="mobile-nav-wrapper" ref={mobileNavRef}>
              <button
                type="button"
                className="mobile-nav-toggle"
                onClick={() => setMobileNavOpen((prev) => !prev)}
                aria-label={
                  mobileNavOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
                aria-expanded={mobileNavOpen}
              >
                <i
                  className={`icon ${mobileNavOpen ? "icon-times" : "icon-bars"}`}
                />
              </button>

              {mobileNavOpen && (
                <div className="mobile-nav-dropdown">
                  <ul className="mobile-nav-list">
                    <li>
                      <Link
                        href="/sign-in"
                        className="mobile-nav-link"
                        onClick={() => setMobileNavOpen(false)}
                      >
                        <i className="icon icon-user-circle" />
                        <span>Sign In</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/create-account"
                        className="mobile-nav-link mobile-nav-cta"
                        onClick={() => setMobileNavOpen(false)}
                      >
                        <span>Create Account</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
