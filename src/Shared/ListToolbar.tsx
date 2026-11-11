import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { SearchBox } from '@/Shared/SearchBox'

type ListToolbarProps = {
  action: string
  placeholder: string
  query: string
  onQuery: (value: string) => void
  to?: string
  onAction?: () => void
}

export function ListToolbar({ to, action, placeholder, query, onQuery, onAction }: ListToolbarProps) {
  return (
    <Row>
      <SearchSlot>
        <SearchBox value={query} placeholder={placeholder} onChange={onQuery} />
      </SearchSlot>
      {onAction ? (
        <AddButton type="button" onClick={onAction}>
          <span aria-hidden="true">+</span>
          {action}
        </AddButton>
      ) : (
        <Add to={to ?? '/'}>
          <span aria-hidden="true">+</span>
          {action}
        </Add>
      )}
    </Row>
  )
}

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`

const SearchSlot = styled.div`
  width: min(480px, 100%);
  flex: 0 1 480px;
`

const addLook = css`
  height: 46px;
  padding: 0 18px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.onAccent};
  font: inherit;
  font-weight: 700;
  box-shadow: 0 8px 18px rgba(38, 115, 247, 0.28);
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.accentHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.text};
    outline-offset: 2px;
  }
`

const Add = styled(Link)`
  ${addLook};
`

const AddButton = styled.button`
  ${addLook};
`
