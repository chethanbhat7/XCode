"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Project, Task } from "@/lib/dashboard-types";
import { Send, MessageCircle, Plus } from "lucide-react";
import { formatDate, getDaysUntil } from "@/lib/date-formatter";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface ProjectChatbotProps {
  project: Project;
  onTaskCreate?: (task: Partial<Task>) => void;
}

export default function ProjectChatbot({ project, onTaskCreate }: ProjectChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      type: "ai",
      content: `Hi! I'm your AI assistant for ${project.name}. I can answer questions about the project, suggest tasks, and help you manage the work. What would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const scrollToBottom = () => {
      const element = document.getElementById(`chatbot-messages-${project.id}`);
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    };
    scrollToBottom();
  }, [messages, project.id]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerInput = userMessage.toLowerCase();

    // Task creation patterns
    if (lowerInput.includes("create task") || lowerInput.includes("add task") || lowerInput.includes("new task")) {
      if (onTaskCreate) {
        const taskTitle = userMessage
          .replace(/create task|add task|new task/gi, "")
          .trim() || "New Task";
        onTaskCreate({
          title: taskTitle,
          description: "Created via AI assistant",
          status: "todo",
          priority: "medium",
          projectId: project.id,
        });
      }
      return `✓ Created task: "${userMessage.replace(/create task|add task|new task/gi, "").trim() || "New Task"}". I've added it to your project.`;
    }

    // Project status/progress queries
    if (lowerInput.includes("progress") || lowerInput.includes("status")) {
      const completedTasks = project.tasks.filter((t) => t.status === "completed").length;
      return `${project.name} is at ${project.progress}% progress. You have ${completedTasks}/${project.tasks.length} tasks completed. The project is currently in "${project.status}" status.`;
    }

    // Team info
    if (lowerInput.includes("team") || lowerInput.includes("member")) {
      const teamSize = project.teamMembers.length;
      const members = project.teamMembers.slice(0, 3).map((m) => m.name).join(", ");
      return `Your team has ${teamSize} members: ${members}${teamSize > 3 ? ", and others" : ""}. Would you like details about any team member?`;
    }

    // Timeline/deadline
    if (lowerInput.includes("deadline") || lowerInput.includes("due") || lowerInput.includes("timeline")) {
      const daysRemaining = getDaysUntil(project.dueDate);
      return `${project.name} is due on ${formatDate(project.dueDate)}. That's approximately ${daysRemaining} days from now.`;
    }

    // Tasks list
    if (lowerInput.includes("tasks") || lowerInput.includes("todo") || lowerInput.includes("list")) {
      const inProgressCount = project.tasks.filter((t) => t.status === "in-progress").length;
      const todoCount = project.tasks.filter((t) => t.status === "todo").length;
      return `You have ${project.tasks.length} total tasks: ${todoCount} to-do, ${inProgressCount} in progress, and ${project.tasks.filter((t) => t.status === "completed").length} completed.`;
    }

    // Repository/commits
    if (lowerInput.includes("commit") || lowerInput.includes("code") || lowerInput.includes("repository")) {
      return `${project.name} has ${project.commits || 0} commits. Repository: ${project.repository || "Not configured"}. The project is progressing well with regular code updates.`;
    }

    // Default helpful response
    return `I can help you with ${project.name}! Try asking me about:\n• Project progress or status\n• Team members\n• Deadlines and timelines\n• Tasks and to-dos\n• Creating new tasks\n• Repository info\n\nWhat would you like to know?`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 500);
  };

  return (
    <GlassCard style={{ display: "flex", flexDirection: "column", height: "600px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <MessageCircle size={18} color="#3b82f6" />
        <h3
          style={{
            fontSize: "1.05rem",
            fontWeight: "700",
            color: "#e5eefc",
            margin: "0",
          }}
        >
          Project Assistant
        </h3>
      </div>

      {/* Messages Area */}
      <div
        id={`chatbot-messages-${project.id}`}
        style={{
          flex: 1,
          overflowY: "auto",
          display: "grid",
          gap: "12px",
          marginBottom: "12px",
          paddingRight: "4px",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "10px 12px",
                borderRadius: "8px",
                background:
                  msg.type === "user"
                    ? "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.1))"
                    : "rgba(255, 255, 255, 0.05)",
                border:
                  msg.type === "user"
                    ? "1px solid rgba(59, 130, 246, 0.2)"
                    : "1px solid rgba(255, 255, 255, 0.06)",
                fontSize: "0.85rem",
                color: "#e5eefc",
                lineHeight: "1.4",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                fontSize: "0.85rem",
                color: "#97a6c0",
              }}
            >
              <span style={{ animation: "pulse 1.5s infinite" }}>●●●</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          placeholder="Ask about project or type 'add task: ...'..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          style={{
            flex: 1,
            padding: "8px 12px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "6px",
            color: "#e5eefc",
            fontSize: "0.85rem",
            outline: "none",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            padding: "8px 12px",
            background: input.trim() ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "6px",
            color: "#3b82f6",
            cursor: input.trim() ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.85rem",
            fontWeight: "600",
            transition: "all 0.2s",
          }}
        >
          <Send size={16} />
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </GlassCard>
  );
}
