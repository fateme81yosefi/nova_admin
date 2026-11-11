import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Avatar } from '@/assets/Icons/ui'
import { useDictionary } from '@/Dictionary/useDictionary'
import { ConfirmModal } from '@/Modals/ConfirmModal'
import { logout } from '@/Redux/authSlice'
import { useAppDispatch, useAppSelector } from '@/Redux/hooks'
import { Button } from '@/Shared/Button'
import { PageHeader } from '@/Shared/PageHeader'
import { RoutePath } from '@/types/Enums/routes'

export function SettingsPage() {
  const text = useDictionary()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const username = useAppSelector((state) => state.auth.username)
  const [confirming, setConfirming] = useState(false)

  function confirmLogout() {
    dispatch(logout())
    setConfirming(false)
    navigate(RoutePath.Login)
  }

  return (
    <section>
      <PageHeader title={text.settings.title} subtitle={text.settings.subtitle} />
      <Card>
        <Identity>
          <Avatar size={52} />
          <div>
            <strong>{text.account.role}</strong>
            <span>
              {text.settings.username}: {username}
            </span>
          </div>
        </Identity>
        <Button variant="ghost" onClick={() => setConfirming(true)}>
          {text.logoutModal.confirm}
        </Button>
      </Card>
      {confirming ? (
        <ConfirmModal
          title={text.logoutModal.title}
          text={text.logoutModal.text}
          confirmLabel={text.logoutModal.confirm}
          cancelLabel={text.logoutModal.cancel}
          onConfirm={confirmLogout}
          onClose={() => setConfirming(false)}
        />
      ) : null}
    </section>
  )
}

const Card = styled.section`
  background: ${({ theme }) => theme.surface};
  border-radius: 20px;
  padding: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  box-shadow: 0 10px 28px rgba(20, 40, 80, 0.05);
`

const Identity = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  strong,
  span {
    display: block;
  }

  span {
    margin-top: 4px;
    color: ${({ theme }) => theme.muted};
  }
`
