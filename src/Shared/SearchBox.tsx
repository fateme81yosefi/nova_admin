import styled from 'styled-components'
import { SearchIcon } from '@/assets/Icons/ui'

type SearchBoxProps = {
  value: string
  placeholder: string
  onChange: (value: string) => void
}

export function SearchBox({ value, placeholder, onChange }: SearchBoxProps) {
  return (
    <Wrap>
      <Icon>
        <SearchIcon />
      </Icon>
      <Input
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </Wrap>
  )
}

const Wrap = styled.label`
  position: relative;
  display: block;
  width: 100%;
`

const Icon = styled.span`
  position: absolute;
  inset-inline-start: 14px;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  color: ${({ theme }) => theme.muted};
  pointer-events: none;
`

const Input = styled.input`
  width: 100%;
  height: 46px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.input};
  color: ${({ theme }) => theme.text};
  padding-inline: 42px 14px;
  font-size: 14px;

  &::placeholder {
    color: ${({ theme }) => theme.muted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 1px;
  }
`
