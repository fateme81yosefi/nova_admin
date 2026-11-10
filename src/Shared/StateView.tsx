import styled from 'styled-components'
import emptyBox from '@/assets/Images/empty-box.svg'
import { Button } from './Button'

type StateViewProps = {
  title: string
  actionLabel?: string
  onAction?: () => void
}

export function LoadingState({ title }: { title: string }) {
  return (
    <Box>
      <Spinner />
      <p>{title}</p>
    </Box>
  )
}

export function EmptyState({ title }: { title: string }) {
  return (
    <Box>
      <img src={emptyBox} alt="" width={92} height={70} />
      <p>{title}</p>
    </Box>
  )
}

export function ErrorState({ title, actionLabel, onAction }: StateViewProps) {
  return (
    <Box>
      <p>{title}</p>
      {actionLabel && onAction ? (
        <Button variant="ghost" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Box>
  )
}

const Box = styled.div`
  min-height: 240px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 12px;
  text-align: center;
  color: ${({ theme }) => theme.muted};
  background: ${({ theme }) => theme.surface};
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: 18px;
  padding: 28px;
`

const Spinner = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.border};
  border-top-color: ${({ theme }) => theme.accent};
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`
