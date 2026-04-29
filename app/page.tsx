"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { readSession, saveSession } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const session = readSession();
    if (session) {
      router.replace(session.role === "developer" ? "/developer" : "/manager");
    }
  }, [router]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "manager@pulseboard.dev");
    const role = String(formData.get("role") || "manager") as "manager" | "developer";

    saveSession({ email, role, name: email.split("@")[0] });
    router.push(role === "developer" ? "/developer" : "/manager");
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-brand card">
          <div className="brand-row">
            <div className="brand-mark">P</div>
            <div>
              <h1>PulseBoard</h1>
              <p>AI project dashboard for managers and developers</p>
            </div>
          </div>

          <div className="auth-copy">
            <h2>Sign in to the project control center</h2>
            <p>Track tasks, AI-assisted planning, developer usage, and team activity from one clean workspace.</p>
          </div>

          <div className="auth-highlights">
            <div className="highlight-item">
              <span className="dot success" />
              <div>
                <strong>Manager view</strong>
                <p>Project health, assignment, and AI task breakdown.</p>
              </div>
            </div>
            <div className="highlight-item">
              <span className="dot blue" />
              <div>
                <strong>Developer view</strong>
                <p>Extension sync, chat, and usage telemetry.</p>
              </div>
            </div>
            <div className="highlight-item">
              <span className="dot warning" />
              <div>
                <strong>Ready for expansion</strong>
                <p>Split into modules, not a monolithic app.</p>
              </div>
            </div>
          </div>
        </section>

        <Card className="auth-form">
          <div className="panel-head">
            <div>
              <h3>Welcome back</h3>
              <span>Use a role to enter the correct workspace</span>
            </div>
            <Badge>Demo</Badge>
          </div>

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <Input id="email" name="email" type="email" defaultValue="manager@pulseboard.dev" placeholder="manager@pulseboard.dev" required />
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
            <Button className="full-width" type="submit">Enter dashboard</Button>
          </form>

          <p className="footer-note">Demo login only for now. I’ll wire this to a backend auth provider next so the app can grow cleanly.</p>
        </Card>
      </div>
    </main>
  );
}
