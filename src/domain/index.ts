export const RESEARCH_SCHEMA_VERSION = 1 as const

export type ArtifactStatus = 'draft' | 'final' | 'failed'

export interface SourceRef {
  id: string
  kind: 'paper' | 'dataset' | 'repository' | 'note' | 'other'
  locator: string
  accessedAt?: string
}

export interface Project {
  schema_version: typeof RESEARCH_SCHEMA_VERSION
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Artifact {
  schema_version: typeof RESEARCH_SCHEMA_VERSION
  id: string
  project_id: string
  type: string
  path: string
  sha256: string
  created_at: string
  status: ArtifactStatus
  sources: SourceRef[]
}

export interface ResearchHealth {
  plugin_version: string
  services: readonly string[]
  schema_version: typeof RESEARCH_SCHEMA_VERSION
}
