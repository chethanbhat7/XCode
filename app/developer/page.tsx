"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { readSession } from "@/lib/session";

export default function DeveloperPreviewPage() {
  const router = useRouter();
  const session = readSession();

  useEffect(() => {
    if (!session) {
      router.replace("/");
    }
  }, [router, session]);

  if (!session) return null;

  // Developer view is not available yet — show minimal placeholder.
  return (
    <div style={{ padding: 24 }}>
      <h2>Developer workspace</h2>
      <p>Developer view is not available right now.</p>
    </div>
  );
}