import styled from 'styled-components'
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

type FieldProps = {
  label: string
  error?: string
}

export function TextField({
  label,
  error,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field>
      <Label>{label}</Label>
      <Input id={props.id ?? props.name} $invalid={Boolean(error)} {...props} />
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Field>
  )
}

export function TextArea({
  label,
  error,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Field>
      <Label>{label}</Label>
      <Area id={props.id ?? props.name} $invalid={Boolean(error)} {...props} />
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Field>
  )
}

type Option = {
  value: string
  label: string
}

type SelectProps = FieldProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    placeholder: string
    options: Option[]
  }

export function SelectField({ label, error, placeholder, options, ...props }: SelectProps) {
  return (
    <Field>
      <Label>{label}</Label>
      <Select id={props.id ?? props.name} $invalid={Boolean(error)} {...props}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Field>
  )
}

const Field = styled.label`
  display: grid;
  gap: 6px;
`

const Label = styled.span`
  font-size: 13px;
  font-weight: 600;
`

const control = `
  width: 100%;
  border-radius: 12px;
  padding: 11px 12px;
  font-size: 14px;
`

const Input = styled.input<{ $invalid: boolean }>`
  ${control};
  border: 1px solid ${({ theme, $invalid }) => ($invalid ? theme.danger : theme.border)};
  background: ${({ theme }) => theme.input};
  color: ${({ theme }) => theme.text};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 1px;
  }
`

const Area = styled.textarea<{ $invalid: boolean }>`
  ${control};
  min-height: 120px;
  resize: vertical;
  border: 1px solid ${({ theme, $invalid }) => ($invalid ? theme.danger : theme.border)};
  background: ${({ theme }) => theme.input};
  color: ${({ theme }) => theme.text};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 1px;
  }
`

const Select = styled.select<{ $invalid: boolean }>`
  ${control};
  border: 1px solid ${({ theme, $invalid }) => ($invalid ? theme.danger : theme.border)};
  background: ${({ theme }) => theme.input};
  color: ${({ theme }) => theme.text};
`

const ErrorText = styled.small`
  color: ${({ theme }) => theme.danger};
  font-size: 12px;
`
