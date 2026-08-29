/**
 * Types below are transcribed directly from the `components.schemas`
 * section of the provided openapi.json (AI Architect API v0.1.0).
 * Do not add fields that aren't present in the backend schemas.
 */

// ---------- Projects ----------

export type ProjectStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";

export interface ProjectCreate {
  name: string;
  idea: string;
}

export interface ProjectResponse {
  id: number;
  name: string;
  idea: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

// ---------- Requirements ----------

export interface RequirementContent {
  functional: string[];
  non_functional: string[];
  constraints: string[];
}

export interface RequirementResponse {
  id: number;
  project_id: number;
  version: number;
  content: RequirementContent;
  created_at: string;
  updated_at: string;
}

// ---------- PRD ----------

export interface PRDContent {
  title: string;
  problem_statement: string;
  target_users: string[];
  goals: string[];
  features: string[];
  user_stories: string[];
  assumptions: string[];
  out_of_scope: string[];
}

export interface PRDResponse {
  id: number;
  project_id: number;
  version: number;
  content: PRDContent;
  created_at: string;
  updated_at: string;
}

// ---------- Architecture ----------

export interface ComponentResponse {
  id: number;
  architecture_id: number;
  name: string;
  type: string;
  technology: string | null;
  description: string | null;
  created_at: string;
}

export interface ConnectionResponse {
  id: number;
  architecture_id: number;
  source_component_id: number;
  target_component_id: number;
  protocol: string | null;
  description: string | null;
  created_at: string;
}

export interface ArchitectureDecisionResponse {
  id: number;
  architecture_id: number;
  decision: string;
  rationale: string;
  alternatives: string[];
  tradeoffs: string | null;
  created_at: string;
}

export interface ArchitectureResponse {
  id: number;
  project_id: number;
  version: number;
  overview: string;
  components: ComponentResponse[];
  connections: ConnectionResponse[];
  decisions: ArchitectureDecisionResponse[];
  created_at: string;
  updated_at: string;
}

// ---------- Database design ----------

export interface DatabaseColumn {
  name: string;
  type: string;
  nullable?: boolean;
  primary_key?: boolean;
  unique?: boolean;
  default?: string | null;
  description?: string | null;
}

export interface DatabaseTable {
  name: string;
  description?: string | null;
  columns: DatabaseColumn[];
}

export interface DatabaseRelationship {
  source_table: string;
  source_column: string;
  target_table: string;
  target_column: string;
  relationship_type: string;
}

export interface DatabaseIndex {
  name: string;
  table: string;
  columns: string[];
  unique?: boolean;
}

export interface DatabaseDesignContent {
  tables: DatabaseTable[];
  relationships: DatabaseRelationship[];
  indexes: DatabaseIndex[];
}

export interface DatabaseDesignResponse {
  id: number;
  project_id: number;
  version: number;
  content: DatabaseDesignContent;
  created_at: string;
  updated_at: string;
}

// ---------- API design ----------

export interface APIParameter {
  name: string;
  type: string;
  required?: boolean;
  description?: string | null;
}

export interface APIRequest {
  content_type?: string | null;
  parameters: APIParameter[];
  body?: Record<string, unknown> | null;
}

export interface APIResponse {
  status_code: number;
  description: string;
  content_type?: string | null;
  body?: Record<string, unknown> | null;
}

export interface APIEndpoint {
  method: string;
  path: string;
  summary: string;
  description?: string | null;
  authentication?: string | null;
  request?: APIRequest | null;
  responses: APIResponse[];
}

export interface APIDesignContent {
  endpoints: APIEndpoint[];
  conventions: string[];
}

export interface APIDesignResponse {
  id: number;
  project_id: number;
  version: number;
  content: APIDesignContent;
  created_at: string;
  updated_at: string;
}

// ---------- Roadmap ----------

export interface RoadmapTask {
  title: string;
  description?: string | null;
  priority: string;
  estimated_effort?: string | null;
  dependencies: string[];
}

export interface RoadmapPhase {
  name: string;
  description?: string | null;
  tasks: RoadmapTask[];
}

export interface RoadmapContent {
  phases: RoadmapPhase[];
}

export interface RoadmapResponse {
  id: number;
  project_id: number;
  version: number;
  content: RoadmapContent;
  created_at: string;
  updated_at: string;
}

// ---------- Generations ----------

export type GenerationStatus =
  | "PENDING"
  | "RUNNING"
  | "WAITING_FOR_INPUT"
  | "COMPLETED"
  | "FAILED";

export interface GenerationCreate {
  workflow: string;
  model: string;
}

export interface GenerationResponse {
  id: number;
  project_id: number;
  workflow: string;
  status: GenerationStatus;
  model: string;
  started_at: string | null;
  completed_at: string | null;
  error: string | null;
  created_at: string;
}

// ---------- Clarifications ----------

export interface ClarificationAnswer {
  answer: string;
}

export interface ClarificationAnswerItem {
  id: number;
  answer: string;
}

export interface ClarificationAnswers {
  answers: ClarificationAnswerItem[];
}

export interface ClarificationResponse {
  id: number;
  project_id: number;
  generation_id: number;
  question: string;
  answer: string | null;
  reason: string | null;
  created_at: string;
  answered_at: string | null;
}

// ---------- Errors ----------

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

// ---------- SSE payloads ----------

export type GenerationStage =
  | "requirements"
  | "prd"
  | "clarification"
  | "architecture"
  | "database_design"
  | "api_design"
  | "roadmap";

export interface SSEStatusEvent {
  generation_id: number;
  status: GenerationStatus;
}

export interface SSEClarificationRequiredEvent {
  generation_id: number;
  clarifications: {
    id: number;
    question: string;
    reason: string | null;
    answer: string | null;
  }[];
}

export interface SSECompletedEvent {
  generation_id: number;
}

export interface SSEFailedEvent {
  generation_id: number;
  error: string | null;
}

export interface SSEErrorEvent {
  detail: string;
}

// ---------- Stage SSE events ----------

export interface SSEStageEvent {
  generation_id: number;
  stage: GenerationStage;
}

export interface SSEStageFailedEvent {
  generation_id: number;
  stage: GenerationStage;
  error: string;
}

export type GenerationSSEEvent =
  | { event: "status"; data: SSEStatusEvent }
  | {
      event: "clarification_required";
      data: SSEClarificationRequiredEvent;
    }
  | { event: "completed"; data: SSECompletedEvent }
  | { event: "failed"; data: SSEFailedEvent }
  | { event: "error"; data: SSEErrorEvent }
  | { event: "stage_started"; data: SSEStageEvent }
  | { event: "stage_completed"; data: SSEStageEvent }
  | { event: "stage_waiting"; data: SSEStageEvent }
  | { event: "stage_failed"; data: SSEStageFailedEvent };