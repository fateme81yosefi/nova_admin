import { Language } from '@/types/Enums/language'
import { localizeDigits } from '@/Utils/localizeDigits'

// API قیمت را به دلار نگه می‌دارد. فرم و جدول تومان هستند.
export const USD_TO_TOMAN = 50000

export function tomanToUsd(toman: number) {
  return toman / USD_TO_TOMAN
}

export function formatToman(amountInUsd: number, language: Language) {
  const toman = Math.round(amountInUsd * USD_TO_TOMAN)
  const locale = language === Language.Fa ? 'fa-IR' : 'en-US'
  const formatted = new Intl.NumberFormat(locale, {
    numberingSystem: language === Language.Fa ? 'arabext' : 'latn',
  }).format(toman)
  return localizeDigits(formatted, language)
}
