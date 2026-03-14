import { List, type RowComponentProps } from 'react-window'
import { Box, CircularProgress, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { useCallback } from 'react'

const ITEM_HEIGHT = 160
const LOAD_AHEAD = 5

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RowData = { items: any[]; renderItem: (item: any) => ReactNode }

function VirtualRow({ index, style, ariaAttributes, items, renderItem }: RowComponentProps<RowData>) {
  const item: unknown = items[index]
  return (
    <div style={{ ...style, paddingBottom: 8, boxSizing: 'border-box' }} {...ariaAttributes}>
      {item ? (
        renderItem(item)
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </div>
  )
}

export interface VirtualizedInfiniteListProps<T extends { id: string }> {
  items: T[]
  isLoading: boolean
  isError: boolean
  error?: Error | null
  hasNextPage?: boolean
  isFetchingNextPage: boolean
  loadMore: () => void
  emptyMessage: string
  renderItem: (item: T) => ReactNode
}

export function VirtualizedInfiniteList<T extends { id: string }>({
  items,
  isLoading,
  isError,
  error,
  hasNextPage,
  isFetchingNextPage,
  loadMore,
  emptyMessage,
  renderItem,
}: VirtualizedInfiniteListProps<T>) {
  const rowCount = hasNextPage ? items.length + 1 : items.length

  const handleRowsRendered = useCallback(
    (visibleRows: { startIndex: number; stopIndex: number }) => {
      if (hasNextPage && !isFetchingNextPage && visibleRows.stopIndex >= items.length - LOAD_AHEAD) {
        loadMore()
      }
    },
    [hasNextPage, isFetchingNextPage, items.length, loadMore],
  )

  if (isLoading && items.length === 0) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', height: '100%', textAlign: 'center', p: 2 }}>
        <Typography color="error">
          {error?.message ?? 'Something went wrong while loading the list.'}
        </Typography>
      </Box>
    )
  }

  if (!isLoading && items.length === 0) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', height: '100%', textAlign: 'center', p: 2 }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Box>
    )
  }

  return (
    <List
      rowComponent={VirtualRow}
      rowCount={rowCount}
      rowHeight={ITEM_HEIGHT}
      rowProps={{ items, renderItem }}
      onRowsRendered={handleRowsRendered}
      style={{ height: '100%' }}
    />
  )
}
