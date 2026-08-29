"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/shared/error-state";
import { useAnswerClarifications } from "@/lib/hooks/use-generation";
import type { ClarificationResponse } from "@/lib/api/types";

export function ClarificationPanel({
  projectId,
  generationId,
  clarifications,
}: {
  projectId: number;
  generationId: number;
  clarifications: ClarificationResponse[];
}) {
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [submitError, setSubmitError] = useState<unknown>(null);

  const answerMutation = useAnswerClarifications(
    projectId,
    generationId,
  );

  const unanswered = clarifications.filter(
    (c) => c.answer === null,
  );

  const answered = clarifications.filter(
    (c) => c.answer !== null,
  );

  const allDrafted = unanswered.every(
    (c) => (drafts[c.id] ?? "").trim().length > 0,
  );

  async function handleContinue() {
    setSubmitError(null);

    try {
      await answerMutation.mutateAsync({
        answers: unanswered.map((clarification) => ({
          id: clarification.id,
          answer: (drafts[clarification.id] ?? "").trim(),
        })),
      });
    } catch (err) {
      setSubmitError(err);
    }
  }

  const submitting = answerMutation.isPending;

  return (
    <Card className="border-warning/40">
      <CardHeader>
        <div className="flex size-9 items-center justify-center rounded-full bg-warning/15">
          <HelpCircle className="size-4 text-warning" />
        </div>

        <CardTitle>A few details would help</CardTitle>

        <CardDescription>
          Answer these before generation continues to architecture.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {answered.length > 0 && (
          <div className="space-y-3">
            {answered.map((c) => (
              <div
                key={c.id}
                className="rounded-md border border-border bg-muted/40 p-3"
              >
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">
                    {c.question}
                  </p>

                  <Badge
                    variant="success"
                    className="ml-auto"
                  >
                    Answered
                  </Badge>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {c.answer}
                </p>
              </div>
            ))}
          </div>
        )}

        {unanswered.map((c) => (
          <div
            key={c.id}
            className="space-y-2"
          >
            <Label htmlFor={`clarification-${c.id}`}>
              {c.question}
            </Label>

            {c.reason && (
              <p className="text-xs text-muted-foreground">
                {c.reason}
              </p>
            )}

            <Textarea
              id={`clarification-${c.id}`}
              rows={2}
              value={drafts[c.id] ?? ""}
              onChange={(e) =>
                setDrafts((current) => ({
                  ...current,
                  [c.id]: e.target.value,
                }))
              }
              placeholder="Your answer…"
            />
          </div>
        ))}

        {submitError !== null && (
          <ErrorState error={submitError} />
        )}

        {unanswered.length > 0 && (
          <Button
            onClick={handleContinue}
            disabled={!allDrafted || submitting}
            className="w-full"
          >
            {submitting ? "Submitting…" : "Continue"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}