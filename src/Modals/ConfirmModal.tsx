import styled from 'styled-components'
import { Button } from '@/Shared/Button'

type ConfirmModalProps = {
  title: string
  text: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmModal({
  title,
  text,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Overlay onClick={onClose}>
      <Dialog role="dialog" aria-modal="true" aria-labelledby="confirm-title" onClick={(event) => event.stopPropagation()}>
        <h2 id="confirm-title">{title}</h2>
        <p>{text}</p>
        <Actions>
          <Button variant="ghost" onClick={onClose} autoFocus>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </Actions>
      </Dialog>
    </Overlay>
  )
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(9, 15, 26, 0.55);
  display: grid;
  place-items: center;
  padding: 20px;
  z-index: 20;
`

const Dialog = styled.div`
  width: min(420px, 100%);
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  border-radius: 18px;
  padding: 22px;
  box-shadow: ${({ theme }) => theme.shadow};

  h2 {
    margin: 0 0 8px;
    font-size: 20px;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.muted};
  }
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
`
