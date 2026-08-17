import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { apply } from '../src/index.js'

const roots: string[] = []
afterEach(async () => { await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true }))) })

describe('research-core plugin', () => {
  it('registers the six supported DSH tools and runs health without IO', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-research-plugin-'))
    roots.push(root)
    const definitions: Array<{ name: string, execute: (args: never) => Promise<unknown> }> = []
    const skills: Array<{ name: string }> = []
    apply({
      tools: { register: (definition: never) => { definitions.push(definition as never); return () => undefined } },
      skills: { register: (skill: { name: string }) => { skills.push(skill); return () => undefined } },
    } as never, { workspaceRoot: root })
    expect(definitions.map(item => item.name)).toEqual(['research_health', 'project_create', 'project_get', 'artifact_save', 'artifact_list', 'artifact_get'])
    expect(skills.map(skill => skill.name)).toEqual([
      'paper-search-pro', 'systematic-literature-review', 'academic-paper-review',
      'hypothesis-research-loop', 'statistical-result-analysis', 'research-writing-and-rebuttal',
    ])
    await expect(definitions[0]!.execute({} as never)).resolves.toMatchObject({ services: ['projects', 'artifacts'] })
  })
})
