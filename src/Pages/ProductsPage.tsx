import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ProductEditor, ProductView } from '@/Components/ProductDialogs'
import { useDictionary } from '@/Dictionary/useDictionary'
import { ConfirmModal } from '@/Modals/ConfirmModal'
import { ProductModal } from '@/Modals/ProductModal'
import { useAppDispatch, useAppSelector } from '@/Redux/hooks'
import { loadCatalog, removeProduct } from '@/Redux/productsSlice'
import { EyeIcon, PencilIcon, TrashIcon } from '@/assets/Icons/ui'
import { ListToolbar } from '@/Shared/ListToolbar'
import { RateNote } from '@/Shared/RateNote'
import { PAGE_SIZE, Pagination } from '@/Shared/Pagination'
import { EmptyState, ErrorState, LoadingState } from '@/Shared/StateView'
import { Panel, Table, TableWrap, Thumb } from '@/Shared/table'
import { RequestStatus } from '@/types/Enums/requestStatus'
import type { Product } from '@/types/product'
import { categoryLabel } from '@/Utils/categoryLabel'
import { formatToman } from '@/Utils/formatPrice'
import { safeImageUrl } from '@/Utils/isHttpUrl'

export function ProductsPage() {
  const text = useDictionary()
  const dispatch = useAppDispatch()
  const language = useAppSelector((state) => state.ui.language)
  const { items, status, error, saveError } = useAppSelector((state) => state.products)
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState<Product | null>(null)
  const [editing, setEditing] = useState<Product | null>(null)
  const [removing, setRemoving] = useState<Product | null>(null)

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

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const rows = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  async function confirmRemove() {
    if (!removing) return
    const result = await dispatch(removeProduct({ id: removing.id, local: removing.local }))
    if (removeProduct.fulfilled.match(result)) setRemoving(null)
  }

  return (
    <section>
      <ListToolbar
        onAction={() => setFormOpen(true)}
        action={text.products.create}
        placeholder={text.products.search}
        query={query}
        onQuery={(value) => {
          setQuery(value)
          setPage(1)
        }}
      />
      <RateNote />
      {saveError && !editing ? <Banner>{saveError}</Banner> : null}
      {status === RequestStatus.Error ? (
        <ErrorState title={error || text.common.errorTitle} actionLabel={text.common.retry} onAction={() => dispatch(loadCatalog())} />
      ) : null}
      {status === RequestStatus.Idle || status === RequestStatus.Loading ? <LoadingState title={text.common.loading} /> : null}
      {status === RequestStatus.Success && items.length === 0 ? <EmptyState title={text.products.empty} /> : null}
      {status === RequestStatus.Success && items.length > 0 && visible.length === 0 ? <EmptyState title={text.common.noResult} /> : null}
      {status === RequestStatus.Success && visible.length > 0 ? (
        <Panel>
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <th>{text.products.image}</th>
                  <th>{text.products.name}</th>
                  <th>{text.products.price}</th>
                  <th>{text.products.status}</th>
                  <th>{text.products.actions}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <Thumb src={safeImageUrl(product.image) ?? undefined} alt="" />
                    </td>
                    <td>
                      <Title title={product.title}>{product.title}</Title>
                    </td>
                    <td>
                      <Price>
                        {formatToman(product.price, language)} {text.currency.toman}
                      </Price>
                    </td>
                    <td>
                      <Badge>{text.products.statusActive}</Badge>
                    </td>
                    <td>
                      <Actions>
                        <IconButton type="button" $tone="edit" aria-label={text.products.edit} onClick={() => setEditing(product)}>
                          <PencilIcon />
                        </IconButton>
                        <IconButton type="button" $tone="delete" aria-label={text.products.remove} onClick={() => setRemoving(product)}>
                          <TrashIcon />
                        </IconButton>
                        <IconButton type="button" $tone="view" aria-label={text.products.view} onClick={() => setViewing(product)}>
                          <EyeIcon />
                        </IconButton>
                      </Actions>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
          <Pagination page={currentPage} pageCount={pageCount} total={visible.length} onPageChange={setPage} />
        </Panel>
      ) : null}
      {viewing ? <ProductView product={viewing} onClose={() => setViewing(null)} /> : null}
      {editing ? <ProductEditor product={editing} onClose={() => setEditing(null)} /> : null}
      {removing ? (
        <ConfirmModal
          title={text.products.deleteTitle}
          text={text.products.deleteText}
          confirmLabel={text.products.remove}
          cancelLabel={text.common.cancel}
          onConfirm={() => void confirmRemove()}
          onClose={() => setRemoving(null)}
        />
      ) : null}
      {formOpen ? <ProductModal onClose={() => setFormOpen(false)} /> : null}
    </section>
  )
}

const Title = styled.span`
  display: inline-block;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
`

const Price = styled.span`
  font-weight: 700;
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

const Actions = styled.div`
  direction: ltr;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

const IconButton = styled.button<{ $tone: 'edit' | 'delete' | 'view' }>`
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  display: grid;
  place-items: center;
  cursor: pointer;
  background: ${({ theme }) => theme.surfaceMuted};
  color: ${({ theme, $tone }) => {
    if ($tone === 'delete') return theme.danger
    if ($tone === 'edit') return theme.accent
    return theme.muted
  }};

  &:hover {
    background: ${({ theme }) => theme.border};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
  }
`

const Banner = styled.p`
  margin: 0 0 14px;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.dangerSoft};
  color: ${({ theme }) => theme.danger};
`
