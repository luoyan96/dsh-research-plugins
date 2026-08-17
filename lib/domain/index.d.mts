//#region src/domain/index.d.ts
declare const RESEARCH_SCHEMA_VERSION: 1;
type ArtifactStatus = 'draft' | 'final' | 'failed';
interface SourceRef {
  id: string;
  kind: 'paper' | 'dataset' | 'repository' | 'note' | 'other';
  locator: string;
  accessedAt?: string;
}
interface Project {
  schema_version: typeof RESEARCH_SCHEMA_VERSION;
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
interface Artifact {
  schema_version: typeof RESEARCH_SCHEMA_VERSION;
  id: string;
  project_id: string;
  type: string;
  path: string;
  sha256: string;
  created_at: string;
  status: ArtifactStatus;
  sources: SourceRef[];
}
interface ResearchHealth {
  plugin_version: string;
  services: readonly string[];
  schema_version: typeof RESEARCH_SCHEMA_VERSION;
}
//#endregion
export { Artifact, ArtifactStatus, Project, RESEARCH_SCHEMA_VERSION, ResearchHealth, SourceRef };