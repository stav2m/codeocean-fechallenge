export interface Person {
  id: string
  firstName: string
  lastName: string
  email: string
  catchPhrase: string
  comments: string
}

/** json-server v1 paginated response shape */
export interface JsonServerPageResponse<T> {
  first: number
  prev: number | null
  next: number | null
  last: number
  pages: number
  items: number
  data: T[]
}
