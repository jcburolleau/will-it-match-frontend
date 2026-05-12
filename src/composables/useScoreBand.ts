export type ScoreBandKey = 'excellent' | 'good' | 'partial' | 'weak'

export interface ScoreBand {
  key: ScoreBandKey
  labelKey: 'scoreBandExcellent' | 'scoreBandGood' | 'scoreBandPartial' | 'scoreBandWeak'
  ringStroke: string
  ringTrack: string
  numberText: string
  badgeBg: string
  badgeText: string
  summaryBorder: string
}

export function getScoreBand(score: number): ScoreBand {
  if (score >= 80) {
    return {
      key: 'excellent',
      labelKey: 'scoreBandExcellent',
      ringStroke: 'stroke-emerald-400',
      ringTrack: 'stroke-emerald-400/20',
      numberText: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20',
      badgeText: 'text-emerald-300',
      summaryBorder: 'border-emerald-400/40',
    }
  }
  if (score >= 60) {
    return {
      key: 'good',
      labelKey: 'scoreBandGood',
      ringStroke: 'stroke-cyan-400',
      ringTrack: 'stroke-cyan-400/20',
      numberText: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/20',
      badgeText: 'text-cyan-300',
      summaryBorder: 'border-cyan-400/40',
    }
  }
  if (score >= 40) {
    return {
      key: 'partial',
      labelKey: 'scoreBandPartial',
      ringStroke: 'stroke-orange-400',
      ringTrack: 'stroke-orange-400/20',
      numberText: 'text-orange-400',
      badgeBg: 'bg-orange-500/20',
      badgeText: 'text-orange-300',
      summaryBorder: 'border-orange-400/40',
    }
  }
  return {
    key: 'weak',
    labelKey: 'scoreBandWeak',
    ringStroke: 'stroke-rose-400',
    ringTrack: 'stroke-rose-400/20',
    numberText: 'text-rose-400',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-300',
    summaryBorder: 'border-rose-400/40',
  }
}
