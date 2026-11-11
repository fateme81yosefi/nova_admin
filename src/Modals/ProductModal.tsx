import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import styled from 'styled-components'
import { Form, Formik } from 'formik'
import { useDictionary } from '@/Dictionary/useDictionary'
import { useAppDispatch, useAppSelector } from '@/Redux/hooks'
import { addProduct, clearProductSaveError } from '@/Redux/productsSlice'
import { ThemeMode } from '@/types/Enums/theme'
import type { AppTheme } from '@/styles/theme'
import { categoryLabel } from '@/Utils/categoryLabel'
import { tomanToUsd } from '@/Utils/formatPrice'
import { isHttpUrl } from '@/Utils/isHttpUrl'
import { parseLocalizedNumber } from '@/Utils/localizeDigits'
import { productSchema, type ProductFormValues } from '@/Validations/productSchema'

const maxImageBytes = 2 * 1024 * 1024

const emptyValues: ProductFormValues = {
  title: '',
  price: '',
  category: '',
  image: '',
  localImage: '',
}

type ProductModalProps = {
  onClose: () => void
}

export function ProductModal({ onClose }: ProductModalProps) {
  const text = useDictionary()
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.products.categories)
  const saving = useAppSelector((state) => state.products.saving)
  const saveError = useAppSelector((state) => state.products.saveError)
  const fileRef = useRef<HTMLInputElement>(null)
  const [brokenPreview, setBrokenPreview] = useState('')

  useEffect(() => {
    dispatch(clearProductSaveError())
    return () => {
      dispatch(clearProductSaveError())
    }
  }, [dispatch])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <Overlay onMouseDown={onClose}>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Header>
          <Title id="product-modal-title">{text.productForm.title}</Title>
          <CloseButton type="button" onClick={onClose} aria-label={text.common.close}>
            <CloseIcon />
          </CloseButton>
        </Header>

        <Formik
          initialValues={emptyValues}
          validationSchema={productSchema(text.validation)}
          onSubmit={async (values, helpers) => {
            const toman = parseLocalizedNumber(values.price)
            const result = await dispatch(
              addProduct({
                title: values.title.trim(),
                // توضیح در این طرح نیست؛ عنوان را می‌فرستم تا بدنهٔ API خالی نماند.
                description: values.title.trim(),
                price: tomanToUsd(toman),
                category: values.category,
                image: values.localImage || values.image.trim(),
              }),
            )
            if (addProduct.fulfilled.match(result)) {
              onClose()
              return
            }
            helpers.setSubmitting(false)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldError, setFieldTouched }) => {
            const preview = values.localImage || (isHttpUrl(values.image) ? values.image.trim() : '')
            const showPreview = preview !== '' && preview !== brokenPreview

            async function onFile(event: ChangeEvent<HTMLInputElement>) {
              const file = event.target.files?.[0]
              event.target.value = ''
              if (!file || !file.type.startsWith('image/')) return
              if (file.size > maxImageBytes) {
                await setFieldTouched('image', true, false)
                setFieldError('image', text.validation.imageSize)
                return
              }
              try {
                const dataUrl = await readImageFile(file)
                await setFieldValue('localImage', dataUrl)
                setBrokenPreview('')
              } catch {
                setFieldError('image', text.validation.url)
              }
            }

            return (
              <Form>
                <Body>
                  <Fields>
                    <Field>
                      <FieldLabel htmlFor="product-title">
                        <Star aria-hidden="true">*</Star>
                        {text.productForm.name}
                      </FieldLabel>
                      <Input
                        id="product-title"
                        name="title"
                        autoFocus
                        placeholder={text.productForm.namePlaceholder}
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-required="true"
                        aria-invalid={Boolean(touched.title && errors.title)}
                        $invalid={Boolean(touched.title && errors.title)}
                      />
                      {touched.title && errors.title ? <ErrorText>{errors.title}</ErrorText> : null}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="product-category">
                        <Star aria-hidden="true">*</Star>
                        {text.productForm.category}
                      </FieldLabel>
                      <SelectWrap>
                        <Select
                          id="product-category"
                          name="category"
                          value={values.category}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-required="true"
                          aria-invalid={Boolean(touched.category && errors.category)}
                          $invalid={Boolean(touched.category && errors.category)}
                          $empty={values.category === ''}
                        >
                          <option value="">{text.productForm.categoryPlaceholder}</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {categoryLabel(category, text)}
                            </option>
                          ))}
                        </Select>
                        <Chevron aria-hidden="true">
                          <ChevronIcon />
                        </Chevron>
                      </SelectWrap>
                      {touched.category && errors.category ? <ErrorText>{errors.category}</ErrorText> : null}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="product-price">
                        <Star aria-hidden="true">*</Star>
                        {text.productForm.price}
                      </FieldLabel>
                      <Input
                        id="product-price"
                        name="price"
                        inputMode="decimal"
                        placeholder={text.productForm.pricePlaceholder}
                        value={values.price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-required="true"
                        aria-invalid={Boolean(touched.price && errors.price)}
                        $invalid={Boolean(touched.price && errors.price)}
                      />
                      {touched.price && errors.price ? <ErrorText>{errors.price}</ErrorText> : null}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="product-image">
                        <Star aria-hidden="true">*</Star>
                        {text.productForm.image}
                      </FieldLabel>
                      <Input
                        id="product-image"
                        name="image"
                        dir="ltr"
                        spellCheck={false}
                        placeholder={text.productForm.imagePlaceholder}
                        value={values.image}
                        onChange={(event) => {
                          void setFieldValue('localImage', '')
                          handleChange(event)
                        }}
                        onBlur={handleBlur}
                        aria-required="true"
                        aria-invalid={Boolean(touched.image && errors.image)}
                        $invalid={Boolean(touched.image && errors.image)}
                      />
                      {touched.image && errors.image ? <ErrorText>{errors.image}</ErrorText> : null}
                    </Field>
                  </Fields>

                  <PickerSlot>
                    <Picker type="button" aria-label={text.productForm.pickImage} onClick={() => fileRef.current?.click()}>
                      {showPreview ? (
                        <Preview
                          src={preview}
                          alt=""
                          onError={() => setBrokenPreview(preview)}
                        />
                      ) : (
                        <>
                          <CloudIcon />
                          <span>{text.productForm.pickImage}</span>
                        </>
                      )}
                    </Picker>
                    <FileInput ref={fileRef} type="file" accept="image/*" onChange={(event) => void onFile(event)} />
                  </PickerSlot>
                </Body>

                {saveError ? (
                  <Fail>
                    {text.common.requestFailed}
                    <small>{saveError}</small>
                  </Fail>
                ) : null}

                <Actions>
                  <CancelButton type="button" onClick={onClose}>
                    {text.common.cancel}
                  </CancelButton>
                  <SubmitButton type="submit" disabled={saving}>
                    {saving ? text.productForm.submitting : text.productForm.submit}
                  </SubmitButton>
                </Actions>
              </Form>
            )
          }}
        </Formik>
      </Dialog>
    </Overlay>
  )
}

function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function palette(theme: AppTheme) {
  const dark = theme.mode === ThemeMode.Dark
  return {
    text: dark ? theme.text : '#1B2559',
    muted: dark ? theme.muted : '#98A2B3',
    line: dark ? theme.border : '#E6EAF2',
    card: dark ? theme.surface : '#FFFFFF',
    well: dark ? theme.surfaceMuted : '#F4F6FB',
    field: dark ? theme.input : '#FFFFFF',
    danger: dark ? theme.danger : '#D92D20',
    star: '#F04438',
    blue: theme.accent,
    blueHover: theme.accentHover,
  }
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 6 8 10.5 12.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 30;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(15, 23, 42, 0.28);
`

const Dialog = styled.div`
  width: min(720px, 100%);
  max-height: calc(100vh - 32px);
  overflow: auto;
  padding: 22px 22px 18px;
  border: 1px solid ${({ theme }) => palette(theme).line};
  border-radius: 24px;
  background: ${({ theme }) => palette(theme).card};
  color: ${({ theme }) => palette(theme).text};
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.14);
`

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
`

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: ${({ theme }) => palette(theme).text};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => (theme.mode === ThemeMode.Dark ? 'rgba(255,255,255,0.06)' : 'rgba(15, 23, 42, 0.05)')};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => palette(theme).blue};
    outline-offset: 2px;
  }
`

const Body = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 210px;
  gap: 22px;
  align-items: stretch;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const Fields = styled.div`
  display: grid;
  gap: 14px;
  min-width: 0;
`

const Field = styled.div`
  display: grid;
  gap: 8px;
`

const FieldLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
`

const Star = styled.span`
  color: ${({ theme }) => palette(theme).star};
`

const control = `
  width: 100%;
  height: 46px;
  border-radius: 12px;
  padding: 0 14px;
  font-size: 14px;
`

const Input = styled.input<{ $invalid: boolean }>`
  ${control};
  border: 1px solid ${({ theme, $invalid }) => ($invalid ? palette(theme).danger : palette(theme).line)};
  background: ${({ theme }) => palette(theme).field};
  color: ${({ theme }) => palette(theme).text};

  &::placeholder {
    color: ${({ theme }) => palette(theme).muted};
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => palette(theme).blue};
    outline-offset: 1px;
  }
`

const SelectWrap = styled.span`
  position: relative;
  display: block;
`

const Select = styled.select<{ $invalid: boolean; $empty: boolean }>`
  ${control};
  appearance: none;
  padding-inline-end: 40px;
  border: 1px solid ${({ theme, $invalid }) => ($invalid ? palette(theme).danger : palette(theme).line)};
  background: ${({ theme }) => palette(theme).field};
  color: ${({ theme, $empty }) => ($empty ? palette(theme).muted : palette(theme).text)};
  cursor: pointer;

  option {
    color: ${({ theme }) => palette(theme).text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => palette(theme).blue};
    outline-offset: 1px;
  }
`

const Chevron = styled.span`
  position: absolute;
  inset-inline-end: 14px;
  top: 50%;
  display: grid;
  color: ${({ theme }) => palette(theme).muted};
  pointer-events: none;
  transform: translateY(-50%);
`

const ErrorText = styled.small`
  color: ${({ theme }) => palette(theme).danger};
  font-size: 12px;
`

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

const Fail = styled.p`
  margin: 14px 0 0;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.dangerSoft};
  color: ${({ theme }) => theme.danger};
  font-size: 13px;

  small {
    display: block;
    margin-top: 4px;
  }
`

const Actions = styled.div`
  display: flex;
  direction: ltr;
  justify-content: ${({ theme }) => (theme.direction === 'ltr' ? 'flex-end' : 'flex-start')};
  gap: 10px;
  margin-top: 18px;
`

const buttonBase = `
  height: 44px;
  padding: 0 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`

const CancelButton = styled.button`
  ${buttonBase};
  border: 1px solid ${({ theme }) => palette(theme).line};
  background: ${({ theme }) => palette(theme).card};
  color: ${({ theme }) => palette(theme).text};

  &:hover {
    background: ${({ theme }) => (theme.mode === ThemeMode.Dark ? 'rgba(255,255,255,0.04)' : '#F8FAFC')};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => palette(theme).blue};
    outline-offset: 2px;
  }
`

const SubmitButton = styled.button`
  ${buttonBase};
  border: 0;
  background: ${({ theme }) => palette(theme).blue};
  color: #ffffff;

  &:hover:not(:disabled) {
    background: ${({ theme }) => palette(theme).blueHover};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => palette(theme).text};
    outline-offset: 2px;
  }
`
