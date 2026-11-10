import styled from 'styled-components'

export const TableWrap = styled.div`
  overflow-x: auto;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 18px;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;

  th,
  td {
    padding: 14px 16px;
    text-align: start;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    vertical-align: middle;
  }

  th {
    font-size: 13px;
    color: ${({ theme }) => theme.muted};
    font-weight: 600;
    background: ${({ theme }) => theme.surfaceMuted};
  }

  tr:last-child td {
    border-bottom: 0;
  }
`

export const Thumb = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
  background: ${({ theme }) => theme.surfaceMuted};
  border-radius: 10px;
  padding: 4px;
`
