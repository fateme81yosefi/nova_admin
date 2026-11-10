import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AdminLayout() {
  return (
    <Shell>
      <Sidebar />
      <Main>
        <Topbar />
        <Content>
          <Outlet />
        </Content>
      </Main>
    </Shell>
  )
}

const Shell = styled.div`
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
`

const Main = styled.div`
  min-width: 0;
`

const Content = styled.main`
  padding: 28px;
`
