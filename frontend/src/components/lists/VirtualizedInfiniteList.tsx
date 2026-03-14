import { Box, CircularProgress, Typography } from '@mui/material'
import type { ReactNode, UIEvent } from 'react'

const DEFAULT_MIN_ITEM_WIDTH = 280

export interface VirtualizedInfiniteListProps<T> {
  items: T[]
  isLoading: boolean
  isError: boolean
  error?: Error | null
  hasNextPage?: boolean
  isFetchingNextPage: boolean
  loadMore: () => void
  itemHeight: number
  emptyMessage: string
  renderItem: (item: T, index: number) => ReactNode
  /** Minimum width per item; grid shows multiple items per row when container is wider. */
  minItemWidth?: number
}

export function VirtualizedInfiniteList<T>({
  items,
  isLoading,
  isError,
  error,
  hasNextPage,
  isFetchingNextPage,
  loadMore,
  itemHeight,
  emptyMessage,
  renderItem,
  minItemWidth = DEFAULT_MIN_ITEM_WIDTH,
}: VirtualizedInfiniteListProps<T>) {
  if (isLoading && items.length === 0) {
    return (
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          placeContent: 'center',
          height: 320,
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return (
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          placeContent: 'center',
          height: 200,
          textAlign: 'center',
        }}
      >
        <Typography color="error">
          {error?.message || 'Something went wrong while loading the list.'}
        </Typography>
      </Box>
    )
  }

  if (!isLoading && items.length === 0) {
    return (
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          placeContent: 'center',
          height: 200,
          textAlign: 'center',
        }}
      >
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Box>
    )
  }

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!hasNextPage || isFetchingNextPage) return

    const target = event.currentTarget
    const { scrollTop, clientHeight, scrollHeight } = target

    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight)

    if (distanceFromBottom <= itemHeight) {
      loadMore()
    }
  }

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`,
        gap: 2,
        alignContent: 'start',
      }}
      component="div"
      onScroll={handleScroll}
    >
      {items.map((item, index) => (
        <Box key={index} sx={{ minWidth: 0, minHeight: itemHeight }}>
          {renderItem(item, index)}
        </Box>
      ))}
    </Box>
  )
}

