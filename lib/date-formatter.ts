/**
 * Consistent date formatting to avoid hydration mismatches
 */

export function formatDate(date: string | Date, format: "short" | "long" = "short"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    return "Invalid Date";
  }

  if (format === "short") {
    // Format: MMM DD, YYYY (e.g., "Jan 15, 2026")
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } else {
    // Format: Month DD, YYYY
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

export function formatMonthDay(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    return "Invalid Date";
  }

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    return "Invalid Date";
  }

  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDateTime(date: string | Date): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

export function getDaysUntil(dueDate: string | Date): number {
  const due = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diff = due.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
