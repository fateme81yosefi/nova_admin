import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useDictionary } from '@/Dictionary/useDictionary'
import { useAppDispatch, useAppSelector } from '@/Redux/hooks'
import { loadCatalog } from '@/Redux/productsSlice'
import { loadUsers } from '@/Redux/usersSlice'
import { RequestStatus } from '@/types/Enums/requestStatus'
import { Language } from '@/types/Enums/language'
import { RoutePath } from '@/types/Enums/routes'
import { localizeDigits } from '@/Utils/localizeDigits'

export function DashboardPage() {
  const text = useDictionary()
  const dispatch = useAppDispatch()
  const username = useAppSelector((state) => state.auth.username)
  const language = useAppSelector((state) => state.ui.language)
  const products = useAppSelector((state) => state.products)
  const users = useAppSelector((state) => state.users)

  useEffect(() => {
    void dispatch(loadCatalog())
    void dispatch(loadUsers())
  }, [dispatch])

  return (
    <section>
      <h1>
        {text.dashboard.greeting}
        {username ? ` ${username}` : ''}
      </h1>
      <Grid>
        <Card>
          <span>{text.dashboard.products}</span>
          <strong>{countLabel(products.status, products.items.length, language)}</strong>
          <Link to={RoutePath.Products}>{text.dashboard.goProducts}</Link>
        </Card>
        <Card>
          <span>{text.dashboard.users}</span>
          <strong>{countLabel(users.status, users.items.length, language)}</strong>
          <Link to={RoutePath.Users}>{text.dashboard.goUsers}</Link>
        </Card>
      </Grid>
    </section>
  )
}

function countLabel(status: RequestStatus, count: number, language: Language) {
  if (status === RequestStatus.Success) return localizeDigits(count, language)
  if (status === RequestStatus.Error) return '—'
  return '...'
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 280px));
  gap: 14px;
`

const Card = styled.article`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 18px;
  padding: 18px;
  display: grid;
  gap: 8px;

  span {
    color: ${({ theme }) => theme.muted};
  }

  strong {
    font-size: 32px;
  }

  a {
    color: ${({ theme }) => theme.accent};
    font-weight: 700;
  }
`
