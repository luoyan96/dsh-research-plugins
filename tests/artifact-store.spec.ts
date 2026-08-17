import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { ArtifactStore } from '../src/artifact-store.js'

const roots: string[] = []
async function createStore(): Promise<ArtifactStore> {
  const root = await mkdtemp(join(tmpdir(), 'dsh-research-core-'))
  roots.push(root)
  return new ArtifactStore(root)
}
afterEach(async () => { await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true }))) })

describe('ArtifactStore', () => {
  it('persists a project and a provenance-bearing artifact', async () => {
    const store = await createStore()
    await store.createProject({ id: 'demo', name: 'Demo research' })
    const artifact = await store.saveArtifact('demo', { id: 'notes', type: 'notes', content: '# Findings\n', sources: [{ id: 'paper-1', kind: 'paper', locator: 'doi:10.1000/example' }] })
    expect(artifact.sha256).toMatch(/^[a-f0-9]{64}$/)
    await expect(store.getProject('demo')).resolves.toMatchObject({ name: 'Demo research' })
    await expect(store.getArtifact('demo', 'notes')).resolves.toMatchObject({ artifact: { id: 'notes' }, content: '# Findings\n' })
  })

  it('rejects path traversal and factual artifacts without evidence', async () => {
    const store = await createStore()
    await store.createProject({ id: 'demo', name: 'Demo' })
    await expect(store.getProject('../outside')).rejects.toThrow('project id')
    await expect(store.saveArtifact('demo', { id: '../escape', type: 'notes', content: 'x', sources: [] })).rejects.toThrow('factual artifacts')
  })

  it('serializes concurrent artifact writes without losing index entries', async () => {
    const store = await createStore()
    await store.createProject({ id: 'demo', name: 'Demo' })
    await Promise.all(Array.from({ length: 12 }, (_, index) => store.saveArtifact('demo', {
      id: `artifact-${index}`, type: 'test', content: String(index), factual: false, sources: [],
    })))
    expect(await store.listArtifacts('demo')).toHaveLength(12)
  })

  it('does not expose an artifact outside its project, even if its index is tampered with', async () => {
    const store = await createStore()
    await store.createProject({ id: 'demo', name: 'Demo' })
    await store.saveArtifact('demo', { id: 'safe', type: 'note', content: 'safe', factual: false, sources: [] })
    const indexPath = join(roots[0]!, 'research-projects', 'demo', 'artifacts.json')
    const index = JSON.parse(await readFile(indexPath, 'utf8'))
    index.artifacts[0].path = '../../secret.txt'
    await (await import('node:fs/promises')).writeFile(indexPath, JSON.stringify(index))
    await expect(store.getArtifact('demo', 'safe')).rejects.toThrow('unsafe project path')
  })

  it('fails closed on unsupported persisted schemas', async () => {
    const store = await createStore()
    await store.createProject({ id: 'demo', name: 'Demo' })
    const projectPath = join(roots[0]!, 'research-projects', 'demo', 'project.json')
    await (await import('node:fs/promises')).writeFile(projectPath, '{"schema_version":999}')
    await expect(store.getProject('demo')).rejects.toThrow('unsupported or malformed research schema')
  })
})
