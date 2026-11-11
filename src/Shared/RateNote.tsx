import styled from 'styled-components'
import { useDictionary } from '@/Dictionary/useDictionary'
import { useAppSelector } from '@/Redux/hooks'
import { formatRate } from '@/Utils/formatPrice'

export function RateNote() {
  const text = useDictionary()
  const language = useAppSelector((state) => state.ui.language)
  return <Note>{text.currency.rateNote.replace('{rate}', formatRate(language))}</Note>
}

const Note = styled.p`
  margin: 0 0 14px;
  color: ${({ theme }) => theme.muted};
  font-size: 13px;
  line-height: 1.7;
`
