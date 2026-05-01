"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { saveSession } from "@/lib/session";
import { validateRegistration } from "@/lib/validation";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setGeneralError("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const role = String(formData.get("role") || "manager") as "manager" | "developer";

    // Client-side validation
    const validation = validateRegistration(name, email, password, role);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      // Call API endpoint
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setGeneralError(result.error || "Registration failed");
        }
        setLoading(false);
        return;
      }

      // Auto sign-in after registration
      saveSession({ email: result.user.email, role: result.user.role, name: result.user.name });
      router.push(result.user.role === "developer" ? "/developer" : "/manager");
    } catch (err) {
      console.error("Registration error:", err);
      setGeneralError("Failed to register. Please try again.");
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
              <h2 className="auth-title">Create your account</h2>
            </div>
          </div>

          {generalError && (
            <div style={{ padding: "12px 14px", borderRadius: "12px", background: "rgba(251,113,133,0.12)", border: "1px solid rgba(251,113,133,0.3)", color: "#fecdd3", marginBottom: "16px", fontSize: "0.88rem" }}>
              {generalError}
            </div>
          )}

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                onFocus={() => clearFieldError("name")}
                required
              />
              {errors.name && <span style={{ color: "#fecdd3", fontSize: "0.78rem" }}>{errors.name}</span>}
            </div>
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
              <span style={{ color: "#97a6c0", fontSize: "0.78rem" }}>Min 6 chars: uppercase, lowercase, number</span>
            </div>
            <div className="field">
              <label htmlFor="role">Role</label>
              <Select
                id="role"
                name="role"
                defaultValue="manager"
                onFocus={() => clearFieldError("role")}
              >
                <option value="manager">Manager</option>
                <option value="developer">Developer</option>
              </Select>
              {errors.role && <span style={{ color: "#fecdd3", fontSize: "0.78rem" }}>{errors.role}</span>}
            </div>

            <Button className="full-width" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="footer-note">Already registered? <Link href="/">Sign in</Link>.</p>
        </Card>
      </div>
    </main>
  );
}
