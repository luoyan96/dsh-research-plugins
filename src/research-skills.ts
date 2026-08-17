import type { SkillRegistration } from '@deepseek-ai/dsh-skill'

const resourceBase = {
  kind: 'url' as const,
  url: 'https://github.com/luoyan96/dsh-research-skills/tree/main/skills',
}

type Skill = Pick<SkillRegistration, 'name' | 'description' | 'content'>

const skills: readonly Skill[] = [
  {
    name: 'paper-search-pro',
    description: 'Discover and triage academic literature, including Chinese-language queries, into a ranked verified research briefing.',
    content: `# Paper search pro

Require a research question; default to standard. Ask at most one scope question: time range, language, source constraints, or count. Use quick (20–60), standard (60–180), deep (180–400), or audit (systematic-review protocol); never promise coverage sources cannot support.

1. Save a query matrix: concepts, synonyms, exclusions, languages, dates, and source-specific queries.
2. Search available scholarly metadata, discipline indexes, preprint indexes, and the local library. Record unavailable sources.
3. Deduplicate by DOI, stable source ID, then normalized title/year; retain source URLs, query IDs, and retrieval time.
4. Score relevance from title/abstract evidence as high, medium, low, or unresolved; do not infer relevance from venue.
5. Produce a library, search log, and briefing with coverage, deduplication counts, unavailable databases, and metadata gaps. Generate BibTeX only from verified metadata.

Never download PDFs without approval or present unverified citations as results.`,
  },
  {
    name: 'systematic-literature-review',
    description: 'Create a reproducible systematic or scoping literature review with screening records, evidence extraction, and synthesis.',
    content: `# Systematic literature review

Require a review question, scope, and review type. Before retrieval, save a protocol with eligibility criteria, sources, exact queries, screening and extraction fields, synthesis plan, and stop rule.

1. Search the query matrix and log date, source, query, count, and export identity.
2. Deduplicate, then screen title/abstract/full text in order. Preserve every exclusion and reason.
3. Extract metadata, question, data, method, comparator, outcomes, findings, limitations, and source locators for each included study.
4. Assess evidence quality with field-appropriate criteria; missing reporting is not low performance.
5. Synthesize by theme, method, data, and result direction; keep contradictory and null findings visible.

Disclose actual databases, date range, selection flow/counts, and limitations. If incomplete, label it a scoped or incomplete review rather than formal systematic review.`,
  },
  {
    name: 'academic-paper-review',
    description: 'Produce an evidence-grounded peer review or critical reading of one paper, preprint, PDF, or manuscript.',
    content: `# Academic paper review

Require one paper and a purpose: quick triage, internal review, target venue, or revision audit. If only an abstract is accessible, label the result limited-to-abstract and do not score experimental rigor.

1. Record identity, version, venue/status, paper type, and accessible sections.
2. Extract contributions, assumptions, method, data, baselines, metrics, results, limitations, and disclosures with locators.
3. Check headline numbers, matched comparison settings, and claim-to-evidence consistency.
4. Assess novelty, rigor, evidence sufficiency, reproducibility, ethics, and clarity against any supplied rubric.
5. Save an evidence-grounded review ordered by blocking flaws, major concerns, minor comments, and questions.

Every criticism must name evidence (or a concrete absence) and a remedy. Never invent page numbers, prior work, statistical errors, or acceptance recommendations.`,
  },
  {
    name: 'hypothesis-research-loop',
    description: 'Run a hypothesis-driven research loop from literature brief to minimal experiment and auditable next-step decision.',
    content: `# Hypothesis research loop

Create research state, hypotheses, and an append-only log first. Every hypothesis must state a measurable prediction, comparison/baseline, falsifier, evidence, and estimated cost.

1. Use an existing literature briefing or request one; record coverage limits.
2. Generate competing explanations, including a null or simpler one. Do not call a gap novel merely because it is unfamiliar.
3. Score importance, novelty evidence, feasibility, falsifiability, risk, and information gain; record primary and backup decisions.
4. Design the smallest discriminating experiment with baseline, metric, data, seeds/runs, budget, stop rule, and expected outcomes.
5. Wait for explicit approval before installs, downloads, GPU/paid use, private data, or execution.
6. Preserve immutable run facts and raw artifact links; classify results as supports, weakens, inconclusive, or invalid-run.

Never rewrite a prediction after results arrive. Failed and null runs remain in the log.`,
  },
  {
    name: 'statistical-result-analysis',
    description: 'Analyze CSV, JSON, TSV, experiment logs, or result tables and produce a reproducible statistical report.',
    content: `# Statistical result analysis

Require input path, unit of analysis, hypothesis/estimand, primary metric, groups, pairing or repeated-measure structure, and intended decision. Audit schema, missingness, duplicates, invalid ranges, and transforms first.

1. Write a plan with estimand, primary test, alternatives, interval/alpha policy, multiplicity policy, and diagnostics.
2. Select tests from design: paired data require paired or resampled comparisons; repeated measures require a dependence-aware model.
3. Report counts, center/spread, confidence intervals, effect size/direction, test statistic, p-value where appropriate, and exact exclusions.
4. Produce a machine-readable summary, reproducibility path, and report while preserving raw values and seeds.
5. Flag impossible precision, missing denominators, or mismatched comparison settings.

Do not claim causality without a causal design. Report not estimable when inadequate. Never install packages or execute analysis code without approval.`,
  },
  {
    name: 'research-writing-and-rebuttal',
    description: 'Draft, revise, or respond to reviews for Chinese- or English-language academic manuscripts without inventing evidence.',
    content: `# Research writing and rebuttal

Require manuscript files and/or saved research artifacts. Before drafting, map every factual claim, number, figure, and citation to a source/artifact ID and locator. Preserve titles, formulas, variable names, code identifiers, and citation keys unless asked otherwise.

1. Identify new section, language edit, structural rewrite, rebuttal, or submission audit.
2. Outline one claim and evidence per paragraph. Mark missing support as [evidence needed].
3. Draft with claim/evidence separation and verify citations before changing bibliography metadata.
4. For reviewer feedback, make a response matrix with point, interpretation, action, changed locator, evidence, and response.
5. Check claim-evidence links, citations, figure/table/number consistency, reproducibility, limitations, ethics, conflicts, funding, roles, and AI-use requirements.

Every quantitative statement must resolve to an analysis or experiment artifact. Never claim unperformed work or unverified venue policy.`,
  },
]

export const RESEARCH_SKILLS: readonly SkillRegistration[] = skills.map(skill => ({
  ...skill,
  source: 'bundled',
  provider: 'dsh-research-plugins',
  resourceBase,
}))
