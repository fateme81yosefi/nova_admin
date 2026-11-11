import styled from 'styled-components'
import { Form, Formik } from 'formik'
import { ThemeMode } from '@/types/Enums/theme'
import { safeImageUrl } from '@/Utils/isHttpUrl'
import { productSchema } from '@/Validations/productSchema'
import { palette } from './product/palette'
import { ProductForm } from './product/ProductForm'
import { ProductPreview } from './product/ProductPreview'
import { emptyProductValues, useProductForm } from './product/useProductForm'

type ProductModalProps = {
  onClose: () => void
}

export function ProductModal({ onClose }: ProductModalProps) {
  const form = useProductForm(onClose)

  return (
    <Overlay onMouseDown={onClose}>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Header>
          <Title id="product-modal-title">{form.text.productForm.title}</Title>
          <CloseButton type="button" onClick={onClose} aria-label={form.text.common.close}>
            <CloseIcon />
          </CloseButton>
        </Header>

        <Formik initialValues={emptyProductValues} validationSchema={productSchema(form.text.validation)} onSubmit={form.submit}>
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldError, setFieldTouched }) => {
            const preview = safeImageUrl(values.localImage) || safeImageUrl(values.image) || ''
            const showPreview = preview !== '' && preview !== form.brokenPreview

            return (
              <Form>
                <Body>
                  <ProductForm
                    text={form.text}
                    categories={form.categories}
                    values={values}
                    errors={errors}
                    touched={touched}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onImageChange={(event) => {
                      void setFieldValue('localImage', '')
                      handleChange(event)
                    }}
                  />
                  <ProductPreview
                    preview={preview}
                    showPreview={showPreview}
                    fileRef={form.fileRef}
                    onPick={() => form.fileRef.current?.click()}
                    onBroken={() => form.setBrokenPreview(preview)}
                    onFile={(event) => {
                      const file = event.target.files?.[0]
                      event.target.value = ''
                      void form.acceptFile(file, { setFieldValue, setFieldError, setFieldTouched })
                    }}
                  />
                </Body>

                {form.saveError ? (
                  <Fail>
                    {form.text.common.requestFailed}
                    <small>{form.saveError}</small>
                  </Fail>
                ) : null}

                <Actions>
                  <CancelButton type="button" onClick={onClose}>
                    {form.text.common.cancel}
                  </CancelButton>
                  <SubmitButton type="submit" disabled={form.saving}>
                    {form.saving ? form.text.productForm.submitting : form.text.productForm.submit}
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

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
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
