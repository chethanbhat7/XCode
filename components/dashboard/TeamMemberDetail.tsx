"use client";

import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge-advanced";
import { TeamMember } from "@/lib/dashboard-types";

interface Props {
  member: TeamMember | null;
}

export default function TeamMemberDetail({ member }: Props) {
  if (!member) {
    return (
      <GlassCard>
        <div style={{ color: "#97a6c0" }}>Select a member to view contributions</div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div style={{ display: "grid", gap: "8px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", fontSize: "1.2rem" }}>
            {member.avatar || member.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#e5eefc" }}>{member.name}</div>
            <div style={{ fontSize: "0.85rem", color: "#97a6c0" }}>{member.role}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Badge label={`Projects: ${member.active_projects ?? 0}`} />
          <Badge label={`Pending: ${member.pending_tasks ?? 0}`} />
          <Badge label={`Deadline Met: ${Math.round(member.deadline_met_percentage ?? 0)}%`} />
        </div>

        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: "0.85rem", color: "#97a6c0", marginBottom: 6 }}>Contributions</div>
          <div style={{ display: "grid", gap: 6 }}>
            <div style={{ fontSize: "0.95rem", color: "#e5eefc" }}>Commits: {member.contributions?.commits ?? 0}</div>
            <div style={{ fontSize: "0.95rem", color: "#e5eefc" }}>Efficiency: {member.contributions?.efficiency ?? 0}%</div>
            <div style={{ fontSize: "0.95rem", color: "#e5eefc" }}>Backlog: {member.contributions?.backlog ?? member.pending_tasks ?? 0}</div>
          </div>
        </div>

        {member.aiUsage && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: "0.85rem", color: "#97a6c0", marginBottom: 6 }}>AI Usage</div>
            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ fontSize: "0.95rem", color: "#e5eefc" }}>Prompts: {member.aiUsage.promptsUsed}/{member.aiUsage.promptsLimit}</div>
              <div style={{ fontSize: "0.95rem", color: "#e5eefc" }}>Tokens: {member.aiUsage.tokensUsed}/{member.aiUsage.tokensLimit}</div>
              <div style={{ fontSize: "0.95rem", color: "#e5eefc" }}>Sessions: {member.aiUsage.assistantSessions}</div>
              <div style={{ fontSize: "0.75rem", color: "#97a6c0" }}>Last used: {new Date(member.aiUsage.lastUsed).toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
 
export { TeamMemberDetail };

