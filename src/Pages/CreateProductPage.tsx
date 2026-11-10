import { useEffect } from 'react'
import { ProductForm } from '@/Components/ProductForm'
import { useDictionary } from '@/Dictionary/useDictionary'
import { useAppDispatch } from '@/Redux/hooks'
import { clearProductSaveError, loadCatalog } from '@/Redux/productsSlice'
import { PageHeader } from '@/Shared/PageHeader'

export function CreateProductPage() {
  const text = useDictionary()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(clearProductSaveError())
    void dispatch(loadCatalog())
  }, [dispatch])

  return (
    <section>
      <PageHeader title={text.productForm.title} subtitle={text.productForm.subtitle} />
      <ProductForm />
    </section>
  )
}
