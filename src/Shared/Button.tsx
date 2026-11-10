import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger'
}

export function Button({ variant = 'primary', type = 'button', ...props }: ButtonProps) {
  return <StyledButton $variant={variant} type={type} {...props} />
}

export const ButtonLink = styled(Link)`
  height: 42px;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.onAccent};
`

const StyledButton = styled.button<{ $variant: NonNullable<ButtonProps['variant']> }>`
  height: 42px;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
  }

  ${({ theme, $variant }) => {
    if ($variant === 'ghost') {
      return css`
        background: transparent;
        color: ${theme.text};
        border: 1px solid ${theme.border};
      `
    }

    if ($variant === 'danger') {
      return css`
        background: ${theme.danger};
        color: white;
        border: 1px solid ${theme.danger};
      `
    }

    return css`
      background: ${theme.accent};
      color: ${theme.onAccent};
      border: 1px solid ${theme.accent};

      &:hover:not(:disabled) {
        background: ${theme.accentHover};
      }
    `
  }}
`
