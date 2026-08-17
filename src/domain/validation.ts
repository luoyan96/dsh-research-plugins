import type { ArtifactStatus, SourceRef } from './index.js'

const IDENTIFIER = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/

export function requireIdentifier(value: string, field: string): void {
  if (!IDENTIFIER.test(value)) throw new Error(`${field} must be 1-128 URL-safe characters`)
}

export function requireNonEmpty(value: string, field: string): void {
  if (value.trim().length === 0) throw new Error(`${field} must not be empty`)
}

export function requireArtifactStatus(value: string): asserts value is ArtifactStatus {
  if (value !== 'draft' && value !== 'final' && value !== 'failed') {
    throw new Error('status must be draft, final, or failed')
  }
}

export function validateSources(sources: readonly SourceRef[], factual: boolean): void {
  if (factual && sources.length === 0) throw new Error('factual artifacts require at least one source')
  for (const source of sources) {
    requireIdentifier(source.id, 'source.id')
    requireNonEmpty(source.locator, 'source.locator')
  }
}
