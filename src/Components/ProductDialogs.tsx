import { useEffect } from 'react'
import styled from 'styled-components'
import { Form, Formik } from 'formik'
import { useDictionary } from '@/Dictionary/useDictionary'
import { saveProduct } from '@/Redux/productsSlice'
import { useAppDispatch, useAppSelector } from '@/Redux/hooks'
import { Button } from '@/Shared/Button'
import { SelectField, TextArea, TextField } from '@/Shared/fields'
import type { Product } from '@/types/product'
import { categoryLabel } from '@/Utils/categoryLabel'
import { USD_TO_TOMAN, formatToman, tomanToUsd } from '@/Utils/formatPrice'
import { parseLocalizedNumber } from '@/Utils/localizeDigits'
import { productEditSchema } from '@/Validations/productSchema'

type ViewProps = {
  product: Product
  onClose: () => void
}

export function ProductView({ product, onClose }: ViewProps) {
  const text = useDictionary()
  const language = useAppSelector((state) => state.ui.language)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <Overlay onClick={onClose}>
      <Dialog role="dialog" aria-modal="true" aria-labelledby="product-view-title" onClick={(event) => event.stopPropagation()}>
        <Preview src={product.image} alt="" />
        <h2 id="product-view-title">{product.title}</h2>
        <Meta>
          <strong>
            {formatToman(product.price, language)} {text.currency.toman}
          </strong>
          <Badge>{text.products.statusActive}</Badge>
        </Meta>
        <Category>{categoryLabel(product.category, text)}</Category>
        <Description>{product.description}</Description>
        <Actions>
          <Button variant="ghost" onClick={onClose} autoFocus>
            {text.common.close}
          </Button>
        </Actions>
      </Dialog>
    </Overlay>
  )
}

type EditProps = {
  product: Product
  onClose: () => void
}

export function ProductEditor({ product, onClose }: EditProps) {
  const text = useDictionary()
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.products.categories)
  const saveError = useAppSelector((state) => state.products.saveError)
  const options = categories.includes(product.category) ? categories : [product.category, ...categories]

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <Overlay onClick={onClose}>
      <Dialog role="dialog" aria-modal="true" aria-labelledby="product-edit-title" onClick={(event) => event.stopPropagation()}>
        <h2 id="product-edit-title">{text.products.editTitle}</h2>
        {saveError ? <Fail>{saveError}</Fail> : null}
        <Formik
          initialValues={{
            title: product.title,
            description: product.description,
            price: String(Math.round(product.price * USD_TO_TOMAN)),
            category: product.category,
            image: product.image,
          }}
          validationSchema={productEditSchema(text.validation)}
          enableReinitialize
          onSubmit={async (values, helpers) => {
            const result = await dispatch(
              saveProduct({
                id: product.id,
                local: product.local,
                payload: {
                  title: values.title.trim(),
                  description: values.description.trim(),
                  price: tomanToUsd(parseLocalizedNumber(values.price)),
                  category: values.category,
                  image: values.image.trim(),
                },
              }),
            )
            helpers.setSubmitting(false)
            if (saveProduct.fulfilled.match(result)) onClose()
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => {
            return (
              <Form>
                <Grid>
                  <TextField
                    name="title"
                    label={text.productForm.name}
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title ? errors.title : undefined}
                  />
                  <TextField
                    name="price"
                    label={text.productForm.price}
                    inputMode="decimal"
                    value={values.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.price ? errors.price : undefined}
                  />
                  <SelectField
                    name="category"
                    label={text.productForm.category}
                    placeholder={text.productForm.categoryPlaceholder}
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.category ? errors.category : undefined}
                    options={options.map((category) => ({
                      value: category,
                      label: categoryLabel(category, text),
                    }))}
                  />
                  <TextField
                    name="image"
                    label={text.productForm.image}
                    value={values.image}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.image ? errors.image : undefined}
                  />
                  <Wide>
                    <TextArea
                      name="description"
                      label={text.productForm.description}
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.description ? errors.description : undefined}
                    />
                  </Wide>
                </Grid>
                <Actions>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? text.productForm.submitting : text.common.save}
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    {text.common.cancel}
                  </Button>
                </Actions>
              </Form>
            )
          }}
        </Formik>
      </Dialog>
    </Overlay>
  )
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(9, 15, 26, 0.55);
  display: grid;
  place-items: center;
  padding: 20px;
`

const Dialog = styled.div`
  width: min(640px, 100%);
  max-height: min(86vh, 820px);
  overflow: auto;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  border-radius: 20px;
  padding: 22px;
  box-shadow: ${({ theme }) => theme.shadow};

  h2 {
    margin: 0 0 12px;
    font-size: 20px;
  }
`

const Preview = styled.img`
  width: 96px;
  height: 96px;
  object-fit: contain;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceMuted};
  padding: 6px;
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
`

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: ${({ theme }) => theme.successSoft};
  color: ${({ theme }) => theme.success};
  font-size: 13px;
  font-weight: 700;
`

const Category = styled.p`
  margin: 8px 0 0;
  color: ${({ theme }) => theme.muted};
`

const Description = styled.p`
  margin: 12px 0 0;
  line-height: 1.8;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const Wide = styled.div`
  grid-column: 1 / -1;
`

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`

const Fail = styled.p`
  margin: 0 0 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.dangerSoft};
  color: ${({ theme }) => theme.danger};
`
