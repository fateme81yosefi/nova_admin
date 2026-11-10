import styled from 'styled-components'

type SearchBoxProps = {
  value: string
  placeholder: string
  onChange: (value: string) => void
}

export function SearchBox({ value, placeholder, onChange }: SearchBoxProps) {
  return (
    <Input
      value={value}
      placeholder={placeholder}
      aria-label={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

const Input = styled.input`
  width: min(360px, 100%);
  height: 42px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.input};
  color: ${({ theme }) => theme.text};
  padding: 0 12px;
`
