"use client";

import { useState, useTransition } from "react";
import { Check, FileText, Loader2, Save } from "lucide-react";

import { updateCustomerAction } from "@/actions/customer";
import { Button } from "@/components/ui/button";

interface CustomerNotesEditorProps {
  customerId: string;
  initialNotes?: string | null;
}

export function CustomerNotesEditor({ customerId, initialNotes }: CustomerNotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [isPending, startTransition] = useTransition();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = () => {
    setErrorMsg(null);
    setSavedSuccess(false);

    startTransition(async () => {
      try {
        const res = await updateCustomerAction({
          id: customerId,
          notes,
        });

        if (!res.success) {
          setErrorMsg(res.error || "Failed to update notes.");
          return;
        }

        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } catch {
        setErrorMsg("An error occurred while saving notes.");
      }
    });
  };

  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Internal Team Notes
        </h3>
        {savedSuccess && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <Check className="h-3.5 w-3.5" />
            Saved
          </span>
        )}
      </div>

      <textarea
        rows={6}
        placeholder="Record key procurement notes, technical requirements, specialized preferences, or call summaries..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      />

      {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isPending}
          size="sm"
          className="bg-foreground text-background hover:bg-foreground/90 font-medium"
        >
          {isPending ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="mr-1.5 h-3.5 w-3.5" />
          )}
          Save Notes
        </Button>
      </div>
    </div>
  );
}
