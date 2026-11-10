import styled from 'styled-components'
import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Row>
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {action}
    </Row>
  )
}

const Row = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 18px;

  h1 {
    margin: 0;
    font-size: 28px;
  }

  p {
    margin: 6px 0 0;
    color: ${({ theme }) => theme.muted};
  }
`
