import { en } from './en'
import { fa, type Dictionary } from './fa'
import { Language } from '@/types/Enums/language'

export const dictionaries: Record<Language, Dictionary> = {
  [Language.Fa]: fa,
  [Language.En]: en,
}

export type { Dictionary }
