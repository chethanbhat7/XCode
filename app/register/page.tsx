"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { registerUser, saveSession } from "@/lib/session";

export default function RegisterPage() {
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const role = String(formData.get("role") || "manager") as "manager" | "developer";

    const result = registerUser({ name, email, password, role });
    if (!result.ok) {
      alert(result.error || "Could not register");
      return;
    }

    // Auto sign-in after registration
    saveSession({ email, role, name });
    router.push(role === "developer" ? "/developer" : "/manager");
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

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <Input id="name" name="name" type="text" placeholder="Jane Doe" required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <Input id="email" name="email" type="email" placeholder="you@company.com" required />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>
            <div className="field">
              <label htmlFor="role">Role</label>
              <Select id="role" name="role" defaultValue="manager">
                <option value="manager">Manager</option>
                <option value="developer">Developer</option>
              </Select>
            </div>

            <Button className="full-width" type="submit">Create account</Button>
          </form>

          <p className="footer-note">Already registered? <a href="/">Sign in</a>.</p>
        </Card>
      </div>
    </main>
  );
}
