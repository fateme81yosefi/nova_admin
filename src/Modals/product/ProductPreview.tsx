import type { ChangeEvent, RefObject } from 'react'
import styled from 'styled-components'
import { useDictionary } from '@/Dictionary/useDictionary'
import { palette } from './palette'

type ProductPreviewProps = {
  preview: string
  showPreview: boolean
  fileRef: RefObject<HTMLInputElement | null>
  onPick: () => void
  onBroken: () => void
  onFile: (event: ChangeEvent<HTMLInputElement>) => void
}

export function ProductPreview({ preview, showPreview, fileRef, onPick, onBroken, onFile }: ProductPreviewProps) {
  const text = useDictionary()

  return (
    <PickerSlot>
      <Picker type="button" aria-label={text.productForm.pickImage} onClick={onPick}>
        {showPreview ? (
          <Preview src={preview} alt="" onError={onBroken} />
        ) : (
          <>
            <CloudIcon />
            <span>{text.productForm.pickImage}</span>
          </>
        )}
      </Picker>
      <FileInput ref={fileRef} type="file" accept="image/*" onChange={onFile} />
    </PickerSlot>
  )
}

function CloudIcon() {
  return (
    <svg width="72" height="56" viewBox="0 0 72 56" fill="none" aria-hidden="true">
      <path
        d="M22 42h28.4a10.2 10.2 0 0 0 1.8-20.2A14.2 14.2 0 0 0 25 18.2 9.6 9.6 0 0 0 22 42Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="m52.2 12.2.95 2.35 2.35.95-2.35.95-.95 2.35-.95-2.35-2.35-.95 2.35-.95.95-2.35Z" fill="currentColor" />
    </svg>
  )
}

const PickerSlot = styled.div`
  min-width: 0;

  @media (max-width: 720px) {
    order: -1;
  }
`

const Picker = styled.button`
  width: 100%;
  height: 100%;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  border: 0;
  border-radius: 16px;
  background: ${({ theme }) => palette(theme).well};
  color: ${({ theme }) => palette(theme).text};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;

  svg {
    color: ${({ theme }) => palette(theme).muted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => palette(theme).blue};
    outline-offset: 2px;
  }

  @media (max-width: 720px) {
    min-height: 180px;
    height: 180px;
  }
`

const Preview = styled.img`
  width: 100%;
  height: 100%;
  max-height: 320px;
  object-fit: contain;
  pointer-events: none;
`

const FileInput = styled.input`
  display: none;
`
