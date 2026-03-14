import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchJson } from '../../api/client'
import { buildSearchWhereClause } from '../../api/searchWhere'
import type { Person, JsonServerPageResponse } from '../../api/types'

const PAGE_SIZE = 40

type PersonsPageResponse = JsonServerPageResponse<Person>

interface UseInfinitePersonsOptions {
  endpoint: '/users' | '/reviewers'
  searchTerm: string
}

export function useInfinitePersons({ endpoint, searchTerm }: UseInfinitePersonsOptions) {
  const term = searchTerm.trim()

  return useInfiniteQuery<PersonsPageResponse, Error>({
    queryKey: [endpoint, term],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const params: Record<string, string | number | object> = {
        _page: pageParam as number,
        _per_page: PAGE_SIZE,
      }
      if (term) {
        params._where = buildSearchWhereClause(term)
      }
      return fetchJson<PersonsPageResponse>(endpoint, params)
    },
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
  })
}
