import type { CSSProperties } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'

const workflows = [
  ['找论文', '/paper-search-pro：围绕「请填写研究问题」检索近 5 年文献，先给出查询矩阵和检索范围。'],
  ['系统综述', '/systematic-literature-review：围绕「请填写综述问题」建立 protocol，先确认纳入排除标准。'],
  ['精读审稿', '/academic-paper-review：请评审我将提供的论文，先说明可访问内容与审稿范围。'],
  ['研究假设', '/hypothesis-research-loop：探索「请填写研究方向」，先提出可证伪的竞争假设和最小实验。'],
  ['统计分析', '/statistical-result-analysis：我将提供结果文件；先确认分析单位、指标和实验设计。'],
  ['论文写作', '/research-writing-and-rebuttal：我将提供稿件和证据材料；先建立 claim-to-evidence map。'],
] as const

const shell: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '8px 12px',
  border: '1px solid color-mix(in srgb, currentColor 12%, transparent)', borderRadius: 14,
  background: 'color-mix(in srgb, Canvas 90%, currentColor 3%)',
}

const button: CSSProperties = {
  border: 0, borderRadius: 9, padding: '6px 9px', cursor: 'pointer', color: 'inherit',
  background: 'color-mix(in srgb, currentColor 8%, transparent)', font: 'inherit', fontSize: 13,
}

export type ResearchQuickStartDockProps = PropsRuntime<'conversation.input.dock'>

/** Stages an editable explicit Skill invocation in DSH's regular message composer. */
export function ResearchQuickStartDock({ inputActions }: ResearchQuickStartDockProps) {
  return (
    <section style={shell} aria-label="科研快速开始">
      <strong style={{ fontSize: 13, marginRight: 2 }}>科研快速开始</strong>
      {workflows.map(([label, prompt]) => (
        <button key={label} type="button" style={button} onClick={() => { inputActions.setDraft(prompt) }}>
          {label}
        </button>
      ))}
    </section>
  )
}
