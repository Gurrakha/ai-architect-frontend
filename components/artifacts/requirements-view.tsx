import { Card, CardContent } from "@/components/ui/card";
import { DocSection, DocList } from "@/components/shared/doc-section";
import type { RequirementResponse } from "@/lib/api/types";

export function RequirementsView({ data }: { data: RequirementResponse }) {
  return (
    <Card>
      <CardContent className="space-y-8 py-6">
        <DocSection title="Functional requirements">
          <DocList items={data.content.functional} />
        </DocSection>
        <DocSection title="Non-functional requirements">
          <DocList items={data.content.non_functional} />
        </DocSection>
        <DocSection title="Constraints">
          <DocList items={data.content.constraints} />
        </DocSection>
      </CardContent>
    </Card>
  );
}
