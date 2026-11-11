import styled from 'styled-components'

export const IconButton = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: ${({ theme }) => theme.text};
  display: grid;
  place-items: center;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.surfaceMuted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
  }
`
