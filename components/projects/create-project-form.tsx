"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/error-state";
import { useCreateProject } from "@/lib/hooks/use-projects";

export function CreateProjectForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");
  const mutation = useCreateProject();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(
      { name: name.trim(), idea: idea.trim() },
      {
        onSuccess: (project) => {
          router.push(`/projects/${project.id}`);
        },
      },
    );
  }

  const canSubmit = name.trim().length > 0 && idea.trim().length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex size-9 items-center justify-center rounded-full bg-accent">
          <Sparkles className="size-4 text-accent-foreground" />
        </div>
        <CardTitle>Describe your project idea</CardTitle>
        <CardDescription>
          Give it a name and describe what you&apos;re building. AI Architect will turn this into
          requirements, a PRD, architecture, database design, API design, and a roadmap.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Project name</Label>
            <Input
              id="name"
              placeholder="e.g. Fieldnote"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={255}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idea">Project idea</Label>
            <Textarea
              id="idea"
              placeholder="A mobile app that lets field researchers capture structured observations offline and sync them once they're back online..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={6}
              required
            />
          </div>

          {mutation.isError && <ErrorState error={mutation.error} />}

          <Button type="submit" disabled={!canSubmit || mutation.isPending}>
            {mutation.isPending ? "Creating project…" : "Create project"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
