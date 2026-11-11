import { Language } from '@/types/Enums/language'
import { localizeDigits } from '@/Utils/localizeDigits'

const fallbackRate = 50000

function readUsdToToman() {
  const raw = import.meta.env.VITE_USD_TO_TOMAN
  const value = typeof raw === 'string' ? Number(raw) : Number.NaN
  if (!Number.isFinite(value) || value <= 0) return fallbackRate
  return value
}

// نرخ را env تعیین می‌کند تا پنل و فروشگاه یک عدد را نشان بدهند.
export const USD_TO_TOMAN = readUsdToToman()

export function tomanToUsd(toman: number) {
  return toman / USD_TO_TOMAN
}

function formatAmount(amount: number, language: Language) {
  const locale = language === Language.Fa ? 'fa-IR' : 'en-US'
  const formatted = new Intl.NumberFormat(locale, {
    numberingSystem: language === Language.Fa ? 'arabext' : 'latn',
  }).format(amount)
  return localizeDigits(formatted, language)
}

export function formatToman(amountInUsd: number, language: Language) {
  return formatAmount(Math.round(amountInUsd * USD_TO_TOMAN), language)
}

export function formatRate(language: Language) {
  return formatAmount(USD_TO_TOMAN, language)
}
