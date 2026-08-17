import type { Context } from '@deepseek-ai/cordis'
import { defineTool, type ValueSchemaSpec } from '@deepseek-ai/dsh-tools'
import { ArtifactStore } from './artifact-store.js'
import { RESEARCH_SCHEMA_VERSION } from './domain/index.js'

export const name = 'research-core'
export const inject = ['tools']
export const VERSION = '0.1.0'

export interface Config { workspaceRoot?: string }

const sourceSchema = {
  type: 'object', additionalProperties: false,
  properties: { id: { type: 'string', required: true }, kind: { type: 'string', required: true, enum: ['paper', 'dataset', 'repository', 'note', 'other'] }, locator: { type: 'string', required: true }, accessedAt: { type: 'string' } },
} as const satisfies ValueSchemaSpec

const artifactOutput = {
  type: 'object', additionalProperties: false,
  properties: { schema_version: { type: 'integer', required: true }, id: { type: 'string', required: true }, project_id: { type: 'string', required: true }, type: { type: 'string', required: true }, path: { type: 'string', required: true }, sha256: { type: 'string', required: true }, created_at: { type: 'string', required: true }, status: { type: 'string', required: true }, sources: { type: 'array', required: true, items: sourceSchema } },
} as const satisfies ValueSchemaSpec

export function apply(ctx: Context, config: Config = {}): void {
  const store = new ArtifactStore(config.workspaceRoot ?? process.cwd())
  ctx.tools.register(defineTool({
    name: 'research_health', description: 'Report the installed research plugin version and available local services. Does not access the network or filesystem.', parameters: {},
    output: { schema: { type: 'object', additionalProperties: false, properties: { plugin_version: { type: 'string', required: true }, schema_version: { type: 'integer', required: true }, services: { type: 'array', required: true, items: { type: 'string' } } } }, render: (_args, value) => [{ type: 'text', text: `research-core ${value.plugin_version}; services: ${value.services.join(', ')}` }] },
    execute: async () => ({ plugin_version: VERSION, schema_version: RESEARCH_SCHEMA_VERSION, services: ['projects', 'artifacts'] }),
  }))
  ctx.tools.register(defineTool({
    name: 'project_create', description: 'Create or return a local research project.', parameters: { name: { type: 'string', required: true }, id: { type: 'string' } },
    output: { schema: { type: 'object', additionalProperties: false, properties: { schema_version: { type: 'integer', required: true }, id: { type: 'string', required: true }, name: { type: 'string', required: true }, created_at: { type: 'string', required: true }, updated_at: { type: 'string', required: true } } }, render: (_args, value) => [{ type: 'text', text: `project ${value.id} ready` }] },
    execute: args => store.createProject(args),
  }))
  ctx.tools.register(defineTool({
    name: 'project_get', description: 'Read a local research project by id.', parameters: { project_id: { type: 'string', required: true } },
    output: { schema: { type: 'object', additionalProperties: false, properties: { schema_version: { type: 'integer', required: true }, id: { type: 'string', required: true }, name: { type: 'string', required: true }, created_at: { type: 'string', required: true }, updated_at: { type: 'string', required: true } } }, render: (_args, value) => [{ type: 'text', text: `project ${value.id}: ${value.name}` }] },
    execute: args => store.getProject(args.project_id),
  }))
  ctx.tools.register(defineTool({
    name: 'artifact_save', description: 'Atomically save a local research artifact with provenance. Factual artifacts require source references.', parameters: { project_id: { type: 'string', required: true }, id: { type: 'string' }, type: { type: 'string', required: true }, content: { type: 'string', required: true }, sources: { type: 'array', required: true, items: sourceSchema }, status: { type: 'string', enum: ['draft', 'final', 'failed'] }, factual: { type: 'boolean' } },
    output: { schema: artifactOutput, render: (_args, value) => [{ type: 'text', text: `saved artifact ${value.id} (${value.sha256.slice(0, 12)})` }] },
    execute: args => store.saveArtifact(args.project_id, args),
  }))
  ctx.tools.register(defineTool({
    name: 'artifact_list', description: 'List the provenance metadata for artifacts in a local project.', parameters: { project_id: { type: 'string', required: true } },
    output: { schema: { type: 'array', items: artifactOutput }, render: (_args, value) => [{ type: 'text', text: `${value.length} artifacts` }] },
    execute: args => store.listArtifacts(args.project_id),
  }))
  ctx.tools.register(defineTool({
    name: 'artifact_get', description: 'Read one local research artifact and its provenance metadata.', parameters: { project_id: { type: 'string', required: true }, artifact_id: { type: 'string', required: true } },
    output: { schema: { type: 'object', additionalProperties: false, properties: { artifact: { ...artifactOutput, required: true }, content: { type: 'string', required: true } } }, render: (_args, value) => [{ type: 'text', text: `artifact ${value.artifact.id}\n${value.content}` }] },
    execute: args => store.getArtifact(args.project_id, args.artifact_id),
  }))
}
