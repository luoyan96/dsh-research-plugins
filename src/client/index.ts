import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { mountResearchLauncher } from './research-launcher.js'

/**
 * The new-session composer has no additive root slot in DSH yet. Mount against
 * its stable `data-composer-seat` host so the launcher survives the blank /
 * active session transition without replacing DSH's workspace or model UI.
 */
export const inject: readonly string[] = []

export function apply(ctx: ClientContext): void {
  ctx.effect(() => mountResearchLauncher(), 'dsh-research-plugins: new-session launcher')
}
