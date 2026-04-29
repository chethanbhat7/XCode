"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { readSession } from "@/lib/session";

export default function ManagerPreviewPage() {
  const router = useRouter();
  const session = readSession();

  useEffect(() => {
    if (!session) {
      router.replace("/");
    }
  }, [router, session]);

  if (!session) {
    return null;
  }

  return <DashboardView role="manager" />;
}