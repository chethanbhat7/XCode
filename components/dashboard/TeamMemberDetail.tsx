"use client";

import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge-advanced";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TeamMember } from "@/lib/dashboard-types";
import { 
  Mail, 
  Users, 
  TrendingUp,
  Code,
  Target,
  Calendar,
  Award
} from "lucide-react";

interface TeamMemberDetailProps {
  member: TeamMember;
}

export function TeamMemberDetail({ member }: TeamMemberDetailProps) {
  return (
    <div style={{ maxWidth: "800px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          marginBottom: "32px",
          padding: "24px",
          background: "rgba(255, 255, 255, 0.02)",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            fontWeight: "700",
            flexShrink: 0,
          }}
        >
          {member.avatar || member.name.charAt(0)}
        </div>
        <div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: "800",
              color: "#e5eefc",
              margin: "0 0 8px 0",
            }}
          >
            {member.name}
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "#97a6c0",
              margin: "0 0 12px 0",
            }}
          >
            {member.role}
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <Badge label={member.team} variant="info" size="sm" />
            <Badge label={`${member.active_projects} projects`} variant="success" size="sm" />
          </div>
        </div>
      </div>

      {/* Contact & Info */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <GlassCard>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <Mail size={18} color="#3b82f6" />
            <div
              style={{
                fontSize: "0.75rem",
                color: "#97a6c0",
                textTransform: "uppercase",
                fontWeight: "600",
              }}
            >
              Email
            </div>
          </div>
          <a
            href={`mailto:${member.email}`}
            style={{
              fontSize: "0.9rem",
              color: "#3b82f6",
              textDecoration: "none",
            }}
          >
            {member.email}
          </a>
        </GlassCard>

        <GlassCard>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <Users size={18} color="#22c55e" />
            <div
              style={{
                fontSize: "0.75rem",
                color: "#97a6c0",
                textTransform: "uppercase",
                fontWeight: "600",
              }}
            >
              Team
            </div>
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              color: "#e5eefc",
              fontWeight: "600",
            }}
          >
            {member.team}
          </div>
        </GlassCard>
      </div>

      {/* Performance Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <GlassCard>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#97a6c0",
              textTransform: "uppercase",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            Productivity
          </div>
          <ProgressBar
            value={member.departmentProductivity}
            max={100}
            showPercent
            color="green"
          />
        </GlassCard>

        <GlassCard>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#97a6c0",
              textTransform: "uppercase",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            Deadline Met %
          </div>
          <ProgressBar
            value={member.deadline_met_percentage}
            max={100}
            showPercent
            color={member.deadline_met_percentage > 90 ? "green" : "amber"}
          />
        </GlassCard>
      </div>

      {/* Skills */}
      <GlassCard>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: "700",
            color: "#e5eefc",
            margin: "0 0 16px 0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Code size={18} /> Skills
        </h3>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {member.skills.map((skill) => (
            <div key={skill}>
              <Badge label={skill} variant="info" size="sm" />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Additional Info */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <GlassCard>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <Target size={18} color="#fbbf24" />
            <div
              style={{
                fontSize: "0.75rem",
                color: "#97a6c0",
                textTransform: "uppercase",
                fontWeight: "600",
              }}
            >
              Active Projects
            </div>
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#fbbf24",
            }}
          >
            {member.active_projects}
          </div>
        </GlassCard>

        <GlassCard>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <Calendar size={18} color="#3b82f6" />
            <div
              style={{
                fontSize: "0.75rem",
                color: "#97a6c0",
                textTransform: "uppercase",
                fontWeight: "600",
              }}
            >
              Pending Tasks
            </div>
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#3b82f6",
            }}
          >
            {member.pending_tasks}
          </div>
        </GlassCard>

        <GlassCard>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <Award size={18} color="#22c55e" />
            <div
              style={{
                fontSize: "0.75rem",
                color: "#97a6c0",
                textTransform: "uppercase",
                fontWeight: "600",
              }}
            >
              Since
            </div>
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              color: "#22c55e",
              fontWeight: "600",
            }}
          >
            {new Date(member.joinDate).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default TeamMemberDetail;
