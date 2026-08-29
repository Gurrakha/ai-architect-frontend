import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DocSection, DocList } from "@/components/shared/doc-section";
import type { PRDResponse } from "@/lib/api/types";

export function PRDView({ data }: { data: PRDResponse }) {
  const { content } = data;

  return (
    <Card>
      <CardContent className="space-y-8 py-6">
        <div>
          <h2 className="text-lg font-semibold">{content.title}</h2>
        </div>

        <DocSection title="Problem statement">
          <p className="text-sm leading-relaxed">{content.problem_statement}</p>
        </DocSection>

        <Separator />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <DocSection title="Target users">
            <DocList items={content.target_users} />
          </DocSection>
          <DocSection title="Goals">
            <DocList items={content.goals} />
          </DocSection>
        </div>

        <Separator />

        <DocSection title="Features">
          <DocList items={content.features} />
        </DocSection>

        <DocSection title="User stories">
          <DocList items={content.user_stories} />
        </DocSection>

        <Separator />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <DocSection title="Assumptions">
            <DocList items={content.assumptions} />
          </DocSection>
          <DocSection title="Out of scope">
            <DocList items={content.out_of_scope} />
          </DocSection>
        </div>
      </CardContent>
    </Card>
  );
}
