import { Language } from '@/types/Enums/language'

const persianDigits = '۰۱۲۳۴۵۶۷۸۹'
const arabicDigits = '٠١٢٣٤٥٦٧٨٩'

export function localizeDigits(value: string | number, language: Language) {
  const text = String(value)
  if (language !== Language.Fa) return text
  return text.replace(/\d/g, (digit) => persianDigits[Number(digit)] ?? digit)
}

export function parseLocalizedNumber(value: string) {
  const latin = value
    .trim()
    .replace(/[۰-۹]/g, (digit) => String(persianDigits.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(arabicDigits.indexOf(digit)))
    .replace(/[,،٬\s]/g, '')
    .replace(/٫/g, '.')

  if (!/^\d+(\.\d+)?$/.test(latin)) return Number.NaN
  return Number(latin)
}
