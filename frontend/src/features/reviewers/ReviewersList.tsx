import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import { useState, useMemo } from 'react'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { useInfiniteReviewers } from './useInfiniteReviewers'
import { VirtualizedInfiniteList } from '../../components/lists/VirtualizedInfiniteList'
import { ReviewerCard } from './ReviewerCard'

export function ReviewersList() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 400)

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteReviewers({ searchTerm: debouncedSearch })

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  )

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        minHeight: 0,
      }}
    >
      <Typography variant="h6">
        Reviewers
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: search ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                aria-label="Clear search"
                onClick={() => setSearch('')}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        }}
      />
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <VirtualizedInfiniteList
          items={items}
          isLoading={isLoading}
          isError={isError}
          error={error}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          loadMore={fetchNextPage}
          itemHeight={160}
          emptyMessage="No reviewers found for this search."
          renderItem={(reviewer, index) => (
            <ReviewerCard key={index} reviewer={reviewer} />
          )}
          />
        </Box>
      </Box>
    </Box>
  )
}

