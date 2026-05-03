"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { readSession, saveSession } from "@/lib/session";
import { validateEmail, validatePassword } from "@/lib/validation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    const session = readSession();
    if (session) {
      router.replace(session.role === "developer" ? "/developer" : "/manager");
    }
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setGeneralError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    // Client-side validation
    const errors_: { [key: string]: string } = {};
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) errors_.email = emailCheck.error || "";
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) errors_.password = passwordCheck.error || "";

    if (Object.keys(errors_).length > 0) {
      setErrors(errors_);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setGeneralError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Save session cookie for client components
      saveSession({ email: data.user.email, role: data.user.role, name: data.user.name, githubId: data.user.githubId, githubUsername: data.user.githubUsername });
      
      router.push(data.user.role === "developer" ? "/developer" : "/manager");
    } catch (err) {
      console.error("Login error:", err);
      setGeneralError("Failed to sign in. Please try again.");
      setLoading(false);
    }
  }

  function clearFieldError(field: string) {
    setErrors((prev: { [key: string]: string }) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-brand card">
          <div className="brand-row">
            <div className="brand-mark">X</div>
            <div>
              <h1>X Code</h1>
              <p>Project control center</p>
            </div>
          </div>
        </section>

        <Card className="auth-form">
          <div className="panel-head">
            <div>
              <h2 className="auth-title">Sign in</h2>
              <span>Enter your credentials to continue</span>
            </div>
          </div>

          {generalError && (
            <div style={{ padding: "12px 14px", borderRadius: "12px", background: "rgba(251,113,133,0.12)", border: "1px solid rgba(251,113,133,0.3)", color: "#fecdd3", marginBottom: "16px", fontSize: "0.88rem" }}>
              {generalError}
            </div>
          )}

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                onFocus={() => clearFieldError("email")}
                required
              />
              {errors.email && <span style={{ color: "#fecdd3", fontSize: "0.78rem" }}>{errors.email}</span>}
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                onFocus={() => clearFieldError("password")}
                required
              />
              {errors.password && <span style={{ color: "#fecdd3", fontSize: "0.78rem" }}>{errors.password}</span>}
            </div>
            <Button className="full-width" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="footer-note">No account? <a href="/register">Register here</a>.</p>
        </Card>
      </div>
    </main>
  );
}
