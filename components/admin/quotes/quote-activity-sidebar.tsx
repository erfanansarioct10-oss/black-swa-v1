"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Clock, UserCheck, DollarSign, FileText, CheckCircle2 } from "lucide-react";

import { addQuoteActivityNoteAction } from "@/actions/quote-admin";
import type { quoteActivityLogs } from "@/db/schema";
import { Button } from "@/components/ui/button";

interface QuoteActivitySidebarProps {
  quoteId: string;
  logs: (typeof quoteActivityLogs.$inferSelect)[];
}

export function QuoteActivitySidebar({ quoteId, logs }: QuoteActivitySidebarProps) {
  const [noteMessage, setNoteMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteMessage.trim()) return;

    try {
      setIsSubmitting(true);
      setFeedback(null);
      const res = await addQuoteActivityNoteAction({
        quoteId,
        message: noteMessage.trim(),
      });

      if (res.success) {
        setFeedback({ type: "success", message: "Internal note added" });
        setNoteMessage("");
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to add note" });
      }
    } catch {
      setFeedback({ type: "error", message: "An error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIconForAction = (actionType: string) => {
    switch (actionType) {
      case "status_change":
        return <CheckCircle2 className="h-4 w-4 text-sky-500" />;
      case "financial_update":
        return <DollarSign className="h-4 w-4 text-emerald-500" />;
      case "manager_assigned":
        return <UserCheck className="h-4 w-4 text-purple-500" />;
      case "email_sent":
        return <FileText className="h-4 w-4 text-amber-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-500" />
          Activity & Internal Notes
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          {logs.length} events
        </span>
      </div>

      {feedback && (
        <div
          className={`p-2.5 rounded text-xs font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Add Note Form */}
      <form onSubmit={handleAddNote} className="space-y-2">
        <textarea
          value={noteMessage}
          onChange={(e) => setNoteMessage(e.target.value)}
          placeholder="Add an internal staff note or follow-up directive..."
          rows={3}
          className="w-full rounded-md border border-slate-200 p-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !noteMessage.trim()}
            className="bg-slate-900 text-white hover:bg-slate-800"
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            {isSubmitting ? "Saving..." : "Post Note"}
          </Button>
        </div>
      </form>

      {/* Timeline Stream */}
      <div className="space-y-4 pt-2">
        {logs.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-4">
            No activity logged yet.
          </p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-3 text-sm">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-50 border border-slate-200">
                {getIconForAction(log.actionType)}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    {log.authorName}
                  </span>
                  <span className="text-slate-400">
                    {new Date(log.createdAt).toLocaleTimeString("en-NP", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-2 rounded border border-slate-100">
                  {log.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
