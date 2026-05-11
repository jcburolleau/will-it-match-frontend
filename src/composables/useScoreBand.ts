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
      ringStroke: 'stroke-emerald-500',
      ringTrack: 'stroke-emerald-100',
      numberText: 'text-emerald-700',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      summaryBorder: 'border-emerald-400',
    }
  }
  if (score >= 60) {
    return {
      key: 'good',
      labelKey: 'scoreBandGood',
      ringStroke: 'stroke-lime-500',
      ringTrack: 'stroke-lime-100',
      numberText: 'text-lime-700',
      badgeBg: 'bg-lime-100',
      badgeText: 'text-lime-800',
      summaryBorder: 'border-lime-400',
    }
  }
  if (score >= 40) {
    return {
      key: 'partial',
      labelKey: 'scoreBandPartial',
      ringStroke: 'stroke-amber-500',
      ringTrack: 'stroke-amber-100',
      numberText: 'text-amber-700',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      summaryBorder: 'border-amber-400',
    }
  }
  return {
    key: 'weak',
    labelKey: 'scoreBandWeak',
    ringStroke: 'stroke-rose-500',
    ringTrack: 'stroke-rose-100',
    numberText: 'text-rose-700',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-800',
    summaryBorder: 'border-rose-400',
  }
}
