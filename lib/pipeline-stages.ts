export type StageKey =
  | "requirements"
  | "prd"
  | "clarification"
  | "architecture"
  | "database_design"
  | "api_design"
  | "roadmap";

export type StageState =
  | "pending"
  | "running"
  | "completed"
  | "waiting_for_input"
  | "failed";

export interface Stage {
  key: StageKey;
  label: string;
  state: StageState;
}

export type StageStates = Record<StageKey, StageState>;

export const INITIAL_STAGE_STATES: StageStates = {
  requirements: "pending",
  prd: "pending",
  clarification: "pending",
  architecture: "pending",
  database_design: "pending",
  api_design: "pending",
  roadmap: "pending",
};

const LABELS: Record<StageKey, string> = {
  requirements: "Requirements",
  prd: "PRD",
  clarification: "Clarifications",
  architecture: "Architecture",
  database_design: "Database design",
  api_design: "API design",
  roadmap: "Roadmap",
};

export function createStages(states: StageStates): Stage[] {
  return (Object.keys(LABELS) as StageKey[]).map((key) => ({
    key,
    label: LABELS[key],
    state: states[key],
  }));
}