import styled from 'styled-components'

export const Panel = styled.section`
  background: ${({ theme }) => theme.surface};
  border-radius: 20px;
  box-shadow: 0 10px 28px rgba(20, 40, 80, 0.05);
`

export const TableWrap = styled.div`
  overflow-x: auto;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;

  th,
  td {
    padding: 16px 14px;
    text-align: center;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    vertical-align: middle;
  }

  th {
    font-size: 14px;
    color: ${({ theme }) => theme.muted};
    font-weight: 700;
    background: transparent;
  }

  tbody tr:hover td {
    background: ${({ theme }) => theme.surfaceMuted};
  }
`

export const Thumb = styled.img`
  width: 52px;
  height: 52px;
  object-fit: contain;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 4px;
`
