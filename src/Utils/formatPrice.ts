import { Language } from '@/types/Enums/language'

// API قیمت را به دلار می‌دهد. طرح تومان است، پس فقط موقع نمایش تبدیل می‌کنم.
export const USD_TO_TOMAN = 50000

export function formatToman(amountInUsd: number, language: Language) {
  const toman = Math.round(amountInUsd * USD_TO_TOMAN)
  const locale = language === Language.Fa ? 'fa-IR' : 'en-US'
  return new Intl.NumberFormat(locale).format(toman)
}
