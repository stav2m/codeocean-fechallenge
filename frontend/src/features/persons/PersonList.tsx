import { Box, TextField, Typography, InputAdornment, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import { useState, useMemo } from 'react'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { useInfinitePersons } from './useInfinitePersons'
import { VirtualizedInfiniteList } from '../../components/lists/VirtualizedInfiniteList'
import { PersonCard } from './PersonCard'

interface PersonListProps {
  title: string
  endpoint: '/users' | '/reviewers'
}

export function PersonList({ title, endpoint }: PersonListProps) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 400)

  const { data, isLoading, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfinitePersons({ endpoint, searchTerm: debouncedSearch })

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  )

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1, minHeight: 0 }}>
      <Typography variant="h6">{title}</Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton size="small" aria-label="Clear search" onClick={() => setSearch('')}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          },
        }}
      />
      <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <Box sx={{ position: 'absolute', inset: 0 }}>
          <VirtualizedInfiniteList
            items={items}
            isLoading={isLoading}
            isError={isError}
            error={error}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            loadMore={fetchNextPage}
            emptyMessage={`No ${title.toLowerCase()} found for this search.`}
            renderItem={(person) => <PersonCard person={person} />}
          />
        </Box>
      </Box>
    </Box>
  )
}
