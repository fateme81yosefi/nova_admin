import type { Dictionary } from '@/Dictionary/fa'

export function categoryLabel(category: string, dictionary: Dictionary) {
  if (category in dictionary.categories) {
    return dictionary.categories[category as keyof Dictionary['categories']]
  }
  return category
}
