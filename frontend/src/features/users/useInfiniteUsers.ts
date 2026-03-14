import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchJson } from '../../api/client'
import { buildSearchWhereClause } from '../../api/searchWhere'
import type { User, JsonServerPageResponse } from '../../api/types'

const PAGE_SIZE = 40

type UsersPageResponse = JsonServerPageResponse<User>

interface UseInfiniteUsersOptions {
  searchTerm: string
}

export function useInfiniteUsers({ searchTerm }: UseInfiniteUsersOptions) {
  const term = searchTerm.trim()

  return useInfiniteQuery<UsersPageResponse, Error>({
    queryKey: ['users', term],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const params: Record<string, string | number | object> = {
        _page: pageParam as number,
        _per_page: PAGE_SIZE,
      }
      if (term) {
        params._where = buildSearchWhereClause(term)
      }
      return fetchJson<UsersPageResponse>('/users', params)
    },
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
  })
}

