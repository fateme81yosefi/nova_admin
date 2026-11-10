import { useEffect, useMemo, useState } from 'react'
import { useDictionary } from '@/Dictionary/useDictionary'
import { useAppDispatch, useAppSelector } from '@/Redux/hooks'
import { loadCatalog } from '@/Redux/productsSlice'
import { ButtonLink } from '@/Shared/Button'
import { PageHeader } from '@/Shared/PageHeader'
import { SearchBox } from '@/Shared/SearchBox'
import { EmptyState, ErrorState, LoadingState } from '@/Shared/StateView'
import { Table, TableWrap, Thumb } from '@/Shared/table'
import { RequestStatus } from '@/types/Enums/requestStatus'
import { RoutePath } from '@/types/Enums/routes'
import { categoryLabel } from '@/Utils/categoryLabel'
import { formatToman } from '@/Utils/formatPrice'

export function ProductsPage() {
  const text = useDictionary()
  const dispatch = useAppDispatch()
  const language = useAppSelector((state) => state.ui.language)
  const { items, status, error } = useAppSelector((state) => state.products)
  const [query, setQuery] = useState('')

  useEffect(() => {
    void dispatch(loadCatalog())
  }, [dispatch])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return items
    return items.filter((item) => {
      const label = categoryLabel(item.category, text).toLowerCase()
      return item.title.toLowerCase().includes(needle) || item.category.toLowerCase().includes(needle) || label.includes(needle)
    })
  }, [items, query, text])

  return (
    <section>
      <PageHeader
        title={text.products.title}
        subtitle={text.products.subtitle}
        action={<ButtonLink to={RoutePath.CreateProduct}>{text.products.create}</ButtonLink>}
      />
      <SearchBox value={query} placeholder={text.products.search} onChange={setQuery} />
      <Spacer />
      {status === RequestStatus.Error ? (
        <ErrorState
          title={error || text.common.errorTitle}
          actionLabel={text.common.retry}
          onAction={() => dispatch(loadCatalog())}
        />
      ) : null}
      {status === RequestStatus.Idle || status === RequestStatus.Loading ? <LoadingState title={text.common.loading} /> : null}
      {status === RequestStatus.Success && items.length === 0 ? <EmptyState title={text.products.empty} /> : null}
      {status === RequestStatus.Success && items.length > 0 && visible.length === 0 ? (
        <EmptyState title={text.common.noResult} />
      ) : null}
      {status === RequestStatus.Success && visible.length > 0 ? (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>{text.products.image}</th>
                <th>{text.products.name}</th>
                <th>{text.products.price}</th>
                <th>{text.products.category}</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((product) => (
                <tr key={product.id}>
                  <td>
                    <Thumb src={product.image} alt={product.title} />
                  </td>
                  <td>{product.title}</td>
                  <td>
                    {formatToman(product.price, language)} {text.currency.toman}
                  </td>
                  <td>{categoryLabel(product.category, text)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      ) : null}
    </section>
  )
}

function Spacer() {
  return <div style={{ height: 14 }} />
}
