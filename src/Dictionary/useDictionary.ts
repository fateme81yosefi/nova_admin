import { dictionaries } from '@/Dictionary'
import { useAppSelector } from '@/Redux/hooks'

export function useDictionary() {
  const language = useAppSelector((state) => state.ui.language)
  return dictionaries[language]
}
