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
  project?: Project;
  onTaskCreate?: (task: Partial<Task>) => void;
}

export default function ProjectChatbot({ project, onTaskCreate }: ProjectChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      type: "ai",
      content: project 
        ? `Hi! I'm your AI assistant for ${project.name}. I can answer questions about the project, suggest tasks, and help you manage the work. What would you like to know?`
        : "Hi! I'm your PulseBoard AI assistant. I can help you track project progress, manage tasks, and optimize your engineering workflow. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatId = project?.id || "global";

  useEffect(() => {
    const scrollToBottom = () => {
      const element = document.getElementById(`chatbot-messages-${chatId}`);
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    };
    scrollToBottom();
  }, [messages, chatId]);

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
          projectId: project?.id || "global",
        });
      }
      return `✓ Created task: "${userMessage.replace(/create task|add task|new task/gi, "").trim() || "New Task"}". I've added it to your project.`;
    }

    // Project status/progress queries
    if (project && (lowerInput.includes("progress") || lowerInput.includes("status"))) {
      const completedTasks = project.tasks.filter((t) => t.status === "completed").length;
      return `${project.name} is at ${project.progress}% progress. You have ${completedTasks}/${project.tasks.length} tasks completed. The project is currently in "${project.status}" status.`;
    }

    // Team info
    if (project && (lowerInput.includes("team") || lowerInput.includes("member"))) {
      const teamSize = project.teamMembers.length;
      const members = project.teamMembers.slice(0, 3).map((m) => m.name).join(", ");
      return `Your team has ${teamSize} members: ${members}${teamSize > 3 ? ", and others" : ""}. Would you like details about any team member?`;
    }

    // Timeline/deadline
    if (project && (lowerInput.includes("deadline") || lowerInput.includes("due") || lowerInput.includes("timeline"))) {
      const daysRemaining = getDaysUntil(project.dueDate);
      return `${project.name} is due on ${formatDate(project.dueDate)}. That's approximately ${daysRemaining} days from now.`;
    }

    // Tasks list
    if (project && (lowerInput.includes("tasks") || lowerInput.includes("todo") || lowerInput.includes("list"))) {
      const inProgressCount = project.tasks.filter((t) => t.status === "in-progress").length;
      const todoCount = project.tasks.filter((t) => t.status === "todo").length;
      return `You have ${project.tasks.length} total tasks: ${todoCount} to-do, ${inProgressCount} in progress, and ${project.tasks.filter((t) => t.status === "completed").length} completed.`;
    }

    // Repository/commits
    if (project && (lowerInput.includes("commit") || lowerInput.includes("code") || lowerInput.includes("repository"))) {
      return `${project.name} has ${project.commits || 0} commits. Repository: ${project.repository || "Not configured"}. The project is progressing well with regular code updates.`;
    }

    // Default helpful response
    return project 
      ? `I can help you with ${project.name}! Try asking me about:\n• Project progress or status\n• Team members\n• Deadlines and timelines\n• Tasks and to-dos\n• Creating new tasks\n• Repository info\n\nWhat would you like to know?`
      : "I'm your PulseBoard AI assistant. I can help you manage projects, track team productivity, and automate task creation. Try asking about your current projects or team performance!";
  };

  const handleSend = async () => {
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

    try {
      console.log("Sending chat request...", { input, historyLength: messages.length });
      
      // Gemini API requires the first message in history to be from the 'user'
      // We skip the initial greeting message if it exists
      const chatHistory = messages
        .filter(m => m.id !== "init") 
        .map(m => ({
          role: m.type === "user" ? "user" : "model",
          parts: [{ text: m.content }]
        }));

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: chatHistory
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received AI response:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      const aiMsg: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: data.text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Update AI usage metrics
      await fetch("/api/ai/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokens: Math.floor(data.text.length / 4) + Math.floor(input.length / 4), // Rough estimate
          prompts: 1
        }),
      });

    } catch (error: any) {
      console.error("Chatbot Error:", error);
      const errorMsg: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: `Assistant: ${error.message || "I'm having trouble connecting right now. Please check your Gemini API key in .env.local."}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "600px",
      padding: "0",
      overflow: "hidden",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
    }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          background: "linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "rgba(59, 130, 246, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(59, 130, 246, 0.3)"
          }}>
            <MessageCircle size={18} color="#60a5fa" />
          </div>
          <div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#f1f5f9", margin: "0" }}>
              Project Assistant
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
              <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "500" }}>AI Online</span>
            </div>
          </div>
        </div>
        {onTaskCreate && (
           <button 
            onClick={() => onTaskCreate({})}
            style={{
              padding: "6px",
              borderRadius: "6px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#94a3b8",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            title="New Task"
           >
             <Plus size={16} />
           </button>
        )}
      </div>

      {/* Messages Area */}
      <div
        id={`chatbot-messages-${chatId}`}
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "20px",
          scrollBehavior: "smooth"
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
              animation: "slideIn 0.3s ease-out forwards"
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "12px 16px",
                borderRadius: msg.type === "user" ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                background:
                  msg.type === "user"
                    ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                    : "rgba(30, 41, 59, 0.7)",
                backdropFilter: "blur(4px)",
                border:
                  msg.type === "user"
                    ? "1px solid rgba(59, 130, 246, 0.5)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                fontSize: "0.875rem",
                color: "#f1f5f9",
                lineHeight: "1.5",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                boxShadow: msg.type === "user" ? "0 4px 12px rgba(37, 99, 235, 0.2)" : "0 4px 12px rgba(0, 0, 0, 0.1)"
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
                padding: "12px 16px",
                borderRadius: "16px 16px 16px 2px",
                background: "rgba(30, 41, 59, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontSize: "0.875rem",
                color: "#94a3b8",
                display: "flex",
                gap: "4px"
              }}
            >
              <div className="dot" style={{ animationDelay: "0s" }} />
              <div className="dot" style={{ animationDelay: "0.2s" }} />
              <div className="dot" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      {!loading && messages.length < 3 && (
        <div style={{ padding: "0 20px 10px 20px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["Project progress?", "Team details?", "Next deadline?", "New task"].map((q) => (
            <button
              key={q}
              onClick={() => { setInput(q); }}
              style={{
                padding: "4px 10px",
                borderRadius: "20px",
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                color: "#60a5fa",
                fontSize: "0.75rem",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div style={{ 
        padding: "16px 20px", 
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        background: "rgba(15, 23, 42, 0.3)"
      }}>
        <div style={{ 
          display: "flex", 
          gap: "10px",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          padding: "4px 4px 4px 12px",
          transition: "all 0.3s ease"
        }}
        className="input-container"
        >
          <input
            type="text"
            placeholder="Ask about project..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            style={{
              flex: 1,
              padding: "8px 0",
              background: "transparent",
              border: "none",
              color: "#f1f5f9",
              fontSize: "0.875rem",
              outline: "none",
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              width: "36px",
              height: "36px",
              background: input.trim() ? "#2563eb" : "rgba(255, 255, 255, 0.05)",
              borderRadius: "10px",
              color: "white",
              cursor: input.trim() ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              border: "none",
              transform: input.trim() ? "scale(1)" : "scale(0.95)"
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dot {
          width: 6px;
          height: 6px;
          background: #64748b;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
        .input-container:focus-within {
          border-color: rgba(59, 130, 246, 0.5) !important;
          background: rgba(255, 255, 255, 0.06) !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </GlassCard>
  );
}
