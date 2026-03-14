/**
 * Builds a json-server v1 _where clause for filtering by name or email.
 * Supports single-field search and "FirstName LastName" full-name search.
 */
export function buildSearchWhereClause(term: string): object {
  const conditions: object[] = [
    { firstName: { contains: term } },
    { lastName: { contains: term } },
    { email: { contains: term } },
  ]

  const words = term.trim().split(/\s+/).filter(Boolean)
  if (words.length >= 2) {
    const first = words[0]
    const rest = words.slice(1).join(' ')
    conditions.push(
      { firstName: { contains: first }, lastName: { contains: rest } },
      { firstName: { contains: rest }, lastName: { contains: first } },
    )
  }

  return { or: conditions }
}
