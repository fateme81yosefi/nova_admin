import { useEffect, useRef, useState } from 'react'
import type { FormikHelpers } from 'formik'
import { useDictionary } from '@/Dictionary/useDictionary'
import { useAppDispatch, useAppSelector } from '@/Redux/hooks'
import { addProduct, clearProductSaveError } from '@/Redux/productsSlice'
import { tomanToUsd } from '@/Utils/formatPrice'
import { parseLocalizedNumber } from '@/Utils/localizeDigits'
import type { ProductFormValues } from '@/Validations/productSchema'

const maxImageBytes = 2 * 1024 * 1024

export const emptyProductValues: ProductFormValues = {
  title: '',
  price: '',
  category: '',
  image: '',
  localImage: '',
}

type ImageHelpers = Pick<FormikHelpers<ProductFormValues>, 'setFieldError' | 'setFieldTouched' | 'setFieldValue'>

export function useProductForm(onClose: () => void) {
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

  async function submit(values: ProductFormValues, helpers: FormikHelpers<ProductFormValues>) {
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
  }

  async function acceptFile(file: File | undefined, helpers: ImageHelpers) {
    if (!file || !file.type.startsWith('image/') || file.type === 'image/svg+xml') return
    if (file.size > maxImageBytes) {
      await helpers.setFieldTouched('image', true, false)
      helpers.setFieldError('image', text.validation.imageSize)
      return
    }
    try {
      const dataUrl = await readImageFile(file)
      await helpers.setFieldValue('localImage', dataUrl)
      setBrokenPreview('')
    } catch {
      helpers.setFieldError('image', text.validation.url)
    }
  }

  return {
    text,
    categories,
    saving,
    saveError,
    fileRef,
    brokenPreview,
    setBrokenPreview,
    submit,
    acceptFile,
  }
}

function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
