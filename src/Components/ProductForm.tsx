import { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Form, Formik } from 'formik'
import { useDictionary } from '@/Dictionary/useDictionary'
import { addProduct } from '@/Redux/productsSlice'
import { useAppDispatch, useAppSelector } from '@/Redux/hooks'
import { Button } from '@/Shared/Button'
import { SelectField, TextArea, TextField } from '@/Shared/fields'
import { RoutePath } from '@/types/Enums/routes'
import { categoryLabel } from '@/Utils/categoryLabel'
import { formatToman } from '@/Utils/formatPrice'
import { productSchema, type ProductFormValues } from '@/Validations/productSchema'

const emptyValues: ProductFormValues = {
  title: '',
  description: '',
  price: '',
  category: '',
  image: '',
}

export function ProductForm() {
  const text = useDictionary()
  const dispatch = useAppDispatch()
  const language = useAppSelector((state) => state.ui.language)
  const categories = useAppSelector((state) => state.products.categories)
  const saving = useAppSelector((state) => state.products.saving)
  const saveError = useAppSelector((state) => state.products.saveError)
  const [done, setDone] = useState(false)

  return (
    <Card>
      {done ? <Success>{text.productForm.success}</Success> : null}
      {saveError ? (
        <Fail>
          {text.common.requestFailed}
          <small>{saveError}</small>
        </Fail>
      ) : null}

      <Formik
        initialValues={emptyValues}
        validationSchema={productSchema(text.validation)}
        onSubmit={async (values, helpers) => {
          const result = await dispatch(
            addProduct({
              title: values.title.trim(),
              description: values.description.trim(),
              price: Number(values.price),
              category: values.category,
              image: values.image.trim(),
            }),
          )
          if (addProduct.fulfilled.match(result)) {
            helpers.resetForm()
            setDone(true)
          } else {
            setDone(false)
          }
          helpers.setSubmitting(false)
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => {
          const preview = Number(values.price)
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
                  options={categories.map((category) => ({
                    value: category,
                    label: categoryLabel(category, text),
                  }))}
                />
                <TextField
                  name="image"
                  label={text.productForm.image}
                  placeholder={text.productForm.imagePlaceholder}
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
              {Number.isFinite(preview) && preview > 0 ? (
                <Preview>
                  {text.productForm.pricePreview} {formatToman(preview, language)} {text.currency.toman}
                </Preview>
              ) : null}
              <Actions>
                <Button type="submit" disabled={saving}>
                  {saving ? text.productForm.submitting : text.productForm.submit}
                </Button>
                <Back to={RoutePath.Products}>{text.productForm.back}</Back>
              </Actions>
            </Form>
          )
        }}
      </Formik>
    </Card>
  )
}

const Card = styled.section`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 18px;
  padding: 22px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`

const Wide = styled.div`
  grid-column: 1 / -1;
`

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`

const Preview = styled.p`
  margin: 12px 0 0;
  color: ${({ theme }) => theme.muted};
  font-size: 13px;
`

const Success = styled.p`
  margin: 0 0 14px;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.successSoft};
  color: ${({ theme }) => theme.success};
`

const Fail = styled.p`
  margin: 0 0 14px;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.dangerSoft};
  color: ${({ theme }) => theme.danger};

  small {
    display: block;
    margin-top: 4px;
  }
`

const Back = styled(Link)`
  height: 42px;
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  color: ${({ theme }) => theme.muted};
`
