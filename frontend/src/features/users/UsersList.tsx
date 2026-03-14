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
import { useInfiniteUsers } from './useInfiniteUsers'
import { VirtualizedInfiniteList } from '../../components/lists/VirtualizedInfiniteList'
import { UserCard } from './UserCard'

export function UsersList() {
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
  } = useInfiniteUsers({ searchTerm: debouncedSearch })

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
        Users
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
          emptyMessage="No users found for this search."
          renderItem={(user, index) => <UserCard key={index} user={user} />}
          />
        </Box>
      </Box>
    </Box>
  )
}

