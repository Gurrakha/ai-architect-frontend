"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ErrorState } from "@/components/shared/error-state";
import { useCreateGeneration } from "@/lib/hooks/use-generation";

const DEFAULT_WORKFLOW = "full_pipeline";
// const DEFAULT_MODEL = "gemini-1.5-pro";

export function StartGenerationDialog({ projectId }: { projectId: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [workflow, setWorkflow] = useState(DEFAULT_WORKFLOW);
  // const [model, setModel] = useState(DEFAULT_MODEL);
  const mutation = useCreateGeneration(projectId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(
      { workflow: workflow.trim()},
      {
        onSuccess: (generation) => {
          setOpen(false);
          router.push(`/projects/${projectId}/generations/${generation.id}`);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Play />
          Start generation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start generation</DialogTitle>
          <DialogDescription>
            Runs the full pipeline: requirements → PRD → clarifications → architecture →
            database design → API design → roadmap.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workflow">Workflow</Label>
            <Input
              id="workflow"
              value={workflow}
              onChange={(e) => setWorkflow(e.target.value)}
              maxLength={100}
              required
            />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              maxLength={100}
              required
            />
          </div> */}
          {mutation.isError && <ErrorState error={mutation.error} />}
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Starting…" : "Start"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
