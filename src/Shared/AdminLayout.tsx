import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { useDictionary } from '@/Dictionary/useDictionary'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AdminLayout() {
  const text = useDictionary()
  const narrow = useNarrow()
  const [open, setOpen] = useState(() => window.matchMedia('(min-width: 960px)').matches)

  return (
    <Frame>
      <Shell $open={open}>
        <Sidebar open={open} />
        <Main>
          <Topbar menuOpen={open} onMenu={() => setOpen((value) => !value)} />
          <Content>
            <Outlet />
          </Content>
        </Main>
      </Shell>
      {narrow && open ? (
        <Backdrop type="button" aria-label={text.common.closeMenu} onClick={() => setOpen(false)} />
      ) : null}
    </Frame>
  )
}

function useNarrow() {
  const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: 900px)').matches)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)')
    const onChange = () => setNarrow(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return narrow
}

const Frame = styled.div`
  min-height: 100vh;
  padding: 14px;
  background: ${({ theme }) => theme.bg};
`

const Shell = styled.div<{ $open: boolean }>`
  direction: ltr;
  display: grid;
  grid-template-columns: ${({ $open }) => ($open ? '252px' : '0px')} minmax(0, 1fr);
  min-height: calc(100vh - 28px);
  border-radius: 28px;
  overflow: hidden;
  background: ${({ theme }) => theme.content};
  box-shadow: 0 18px 50px rgba(16, 32, 64, 0.08);

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    overflow: visible;

    > * {
      grid-column: 1;
      grid-row: 1;
      min-width: 0;
    }
  }
`

const Main = styled.div`
  direction: ${({ theme }) => theme.direction};
  min-width: 0;
  display: flex;
  flex-direction: column;
`

const Content = styled.main`
  padding: 22px 22px 28px;
`

const Backdrop = styled.button`
  position: fixed;
  inset: 0;
  z-index: 25;
  border: 0;
  background: rgba(15, 23, 42, 0.4);
`
