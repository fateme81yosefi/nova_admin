import styled from 'styled-components'
import { ChevronIcon } from '@/assets/Icons/ui'
import { useDictionary } from '@/Dictionary/useDictionary'
import { useAppSelector } from '@/Redux/hooks'
import { localizeDigits } from '@/Utils/localizeDigits'

export const PAGE_SIZE = 5

type PaginationProps = {
  page: number
  pageCount: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageCount, total, onPageChange }: PaginationProps) {
  const text = useDictionary()
  const language = useAppSelector((state) => state.ui.language)
  if (pageCount <= 1) return null

  const start = (page - 1) * PAGE_SIZE + 1
  const end = Math.min(page * PAGE_SIZE, total)
  const pages = visiblePages(page, pageCount)

  return (
    <Bar aria-label={text.pagination.label}>
      <Range>
        {localizeDigits(start, language)}–{localizeDigits(end, language)} {text.pagination.of}{' '}
        {localizeDigits(total, language)}
      </Range>
      <Controls>
        <Step type="button" disabled={page <= 1} aria-label={text.pagination.previous} onClick={() => onPageChange(page - 1)}>
          <ChevronIcon direction="left" />
        </Step>
        <Pages>
          {pages.map((item, index) =>
            item === 'gap' ? (
              <Gap key={`gap-${index}`} aria-hidden="true">
                …
              </Gap>
            ) : (
              <Page
                key={item}
                type="button"
                aria-current={item === page ? 'page' : undefined}
                $active={item === page}
                onClick={() => onPageChange(item)}
              >
                {item}
              </Page>
            ),
          )}
        </Pages>
        <Step type="button" disabled={page >= pageCount} aria-label={text.pagination.next} onClick={() => onPageChange(page + 1)}>
          <ChevronIcon direction="right" />
        </Step>
      </Controls>
    </Bar>
  )
}

function visiblePages(current: number, count: number) {
  if (count <= 7) return Array.from({ length: count }, (_, index) => index + 1)

  const wanted = [1, count, current - 1, current, current + 1].filter(
    (value, index, list) => value >= 1 && value <= count && list.indexOf(value) === index,
  )
  wanted.sort((left, right) => left - right)

  const result: Array<number | 'gap'> = []
  for (const value of wanted) {
    const previous = result.at(-1)
    if (typeof previous === 'number' && value - previous > 1) result.push('gap')
    result.push(value)
  }
  return result
}

const Bar = styled.nav`
  position: relative;
  display: flex;
  justify-content: flex-end;
  padding: 6px 16px 16px;
`

const Range = styled.p`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
`

const Controls = styled.div`
  direction: ltr;
  display: flex;
  align-items: center;
  gap: 6px;
`

const Pages = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const Step = styled.button`
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.surfaceMuted};
  color: ${({ theme }) => theme.muted};
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
  }
`

const Page = styled.button<{ $active: boolean }>`
  min-width: 34px;
  height: 34px;
  padding: 0 8px;
  border: 0;
  border-radius: 10px;
  background: ${({ theme, $active }) => ($active ? theme.accent : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.onAccent : theme.muted)};
  font-weight: 700;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
  }
`

const Gap = styled.span`
  color: ${({ theme }) => theme.muted};
  min-width: 16px;
  text-align: center;
`
