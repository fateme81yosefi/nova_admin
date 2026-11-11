import type { ChangeEvent, FocusEvent } from 'react'
import styled from 'styled-components'
import { RateNote } from '@/Shared/RateNote'
import { categoryLabel } from '@/Utils/categoryLabel'
import type { Dictionary } from '@/Dictionary/fa'
import type { ProductFormValues } from '@/Validations/productSchema'
import { fieldControl, palette } from './palette'

type ProductFormProps = {
  text: Dictionary
  categories: string[]
  values: ProductFormValues
  errors: Partial<Record<keyof ProductFormValues, string>>
  touched: Partial<Record<keyof ProductFormValues, boolean>>
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onBlur: (event: FocusEvent<HTMLInputElement | HTMLSelectElement>) => void
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export function ProductForm({
  text,
  categories,
  values,
  errors,
  touched,
  onChange,
  onBlur,
  onImageChange,
}: ProductFormProps) {
  return (
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
          onChange={onChange}
          onBlur={onBlur}
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
            onChange={onChange}
            onBlur={onBlur}
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
          onChange={onChange}
          onBlur={onBlur}
          aria-required="true"
          aria-invalid={Boolean(touched.price && errors.price)}
          $invalid={Boolean(touched.price && errors.price)}
        />
        {touched.price && errors.price ? <ErrorText>{errors.price}</ErrorText> : null}
        <RateHint>
          <RateNote />
        </RateHint>
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
          onChange={onImageChange}
          onBlur={onBlur}
          aria-required="true"
          aria-invalid={Boolean(touched.image && errors.image)}
          $invalid={Boolean(touched.image && errors.image)}
        />
        {touched.image && errors.image ? <ErrorText>{errors.image}</ErrorText> : null}
      </Field>
    </Fields>
  )
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 6 8 10.5 12.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

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

const Input = styled.input<{ $invalid: boolean }>`
  ${fieldControl};
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
  ${fieldControl};
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

const RateHint = styled.div`
  p {
    margin: 0;
  }
`
