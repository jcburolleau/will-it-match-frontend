import type { ChatMessage } from '../services/ollama'

export interface FacetScore {
  label: string
  value: number
  note: string
}

export interface EvidencePair {
  tag: string
  cv: string
  jd: string
  verdict: 'match' | 'gap'
}

export interface MatchResult {
  overall_score: number
  verdict: string
  breakdown: FacetScore[]
  matched: string[]
  missing: string[]
  evidence: EvidencePair[]
}

export function buildMatchMessages(args: {
  cvText: string
  jdText: string
  locale: 'en' | 'es'
}): ChatMessage[] {
  const language = args.locale === 'es' ? 'Spanish' : 'English'
  const system = `You are an expert technical recruiter. Compare a CV against a job description and return STRICT JSON only — no prose, no markdown code fences. Use this exact schema:
{
  "overall_score": number (0-100),
  "verdict": string (1-2 sentences summarizing the fit),
  "breakdown": [
    { "label": string (facet name, e.g. "Skills overlap"), "value": number (0-100), "note": string (short explanation) }
  ] (exactly 5 facets: skills overlap, experience level, tooling fluency, domain familiarity, soft signals),
  "matched": string[] (4-8 skills/qualities that match between CV and JD),
  "missing": string[] (2-4 skills/qualities the JD asks for that the CV lacks),
  "evidence": [
    { "tag": string (topic), "cv": string (what the CV says), "jd": string (what the JD asks), "verdict": "match" or "gap" }
  ] (3-5 paired evidence entries comparing specific CV claims to JD requirements)
}

LANGUAGE RULE (critical, overrides everything else):
- Every string value MUST be written in ${language}.
- This applies even if the CV or job description is written in a different language (French, German, Chinese, Portuguese, etc.). Translate any quoted terms or evidence into ${language}.
- Do not mix languages. Do not echo the source language. The full output must read naturally to a ${language} speaker.

VOICE RULE (critical):
- Address the candidate directly in the second person. Do NOT refer to them by name and do NOT use the third person.
- In ${language}, use the informal second-person form (Spanish: "tú" / "tienes" / "podrías"; English: "you" / "you have" / "you could"). Never write things like "Juan tiene…" or "the candidate has…" — write "tienes…" / "you have…" instead.
- Apply this voice to the verdict and evidence entries.

Be concrete and reference evidence from the CV and JD, but always express that evidence in ${language} and in the second person.`

  const user = `### CV\n${args.cvText}\n\n### Job Description\n${args.jdText}\n\nReturn only the JSON object.`

  return [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ]
}

export function parseMatchResponse(raw: string): MatchResult | null {
  const cleaned = stripCodeFence(raw).trim()
  const jsonText = extractFirstJsonObject(cleaned)
  if (!jsonText) return null
  try {
    const parsed = JSON.parse(jsonText) as Partial<MatchResult>
    if (
      typeof parsed.overall_score !== 'number' ||
      typeof parsed.verdict !== 'string' ||
      !Array.isArray(parsed.breakdown) ||
      !Array.isArray(parsed.matched) ||
      !Array.isArray(parsed.missing) ||
      !Array.isArray(parsed.evidence)
    ) {
      return null
    }
    return {
      overall_score: clamp(parsed.overall_score, 0, 100),
      verdict: parsed.verdict,
      breakdown: parsed.breakdown.map((f) => ({
        label: String(f.label ?? ''),
        value: clamp(Number(f.value) || 0, 0, 100),
        note: String(f.note ?? ''),
      })),
      matched: parsed.matched.map(String),
      missing: parsed.missing.map(String),
      evidence: parsed.evidence.map((e) => ({
        tag: String(e.tag ?? ''),
        cv: String(e.cv ?? ''),
        jd: String(e.jd ?? ''),
        verdict: e.verdict === 'gap' ? 'gap' as const : 'match' as const,
      })),
    }
  } catch {
    return null
  }
}

function stripCodeFence(text: string): string {
  const fence = /^```(?:json)?\s*([\s\S]*?)\s*```$/m
  const match = text.match(fence)
  return match ? match[1] : text
}

function extractFirstJsonObject(text: string): string | null {
  const start = text.indexOf('{')
  if (start === -1) return null
  let depth = 0
  for (let i = start; i < text.length; i++) {
    if (text[i] === '{') depth++
    else if (text[i] === '}') {
      depth--
      if (depth === 0) return text.slice(start, i + 1)
    }
  }
  return null
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
