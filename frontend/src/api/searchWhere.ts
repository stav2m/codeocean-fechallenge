/**
 * Builds a json-server v1 _where clause for search by name (firstName, lastName) or email.
 * Supports full-name search: e.g. "Zelma Shields" matches when firstName contains "Zelma"
 * and lastName contains "Shields" (or the other way around).
 */
export function buildSearchWhereClause(term: string): { or: object[] } {
  const conditions: object[] = [
    { firstName: { contains: term } },
    { lastName: { contains: term } },
    { email: { contains: term } },
  ]

  const words = term.split(/\s+/).filter((w) => w.length > 0)
  if (words.length >= 2) {
    conditions.push(
      { firstName: { contains: words[0] }, lastName: { contains: words[1] } },
      { firstName: { contains: words[1] }, lastName: { contains: words[0] } },
    )
    if (words.length > 2) {
      const rest = words.slice(1).join(' ')
      const allButLast = words.slice(0, -1).join(' ')
      conditions.push(
        { firstName: { contains: words[0] }, lastName: { contains: rest } },
        { firstName: { contains: rest }, lastName: { contains: words[0] } },
        { firstName: { contains: allButLast }, lastName: { contains: words[words.length - 1] } },
        { firstName: { contains: words[words.length - 1] }, lastName: { contains: allButLast } },
      )
    }
  }

  return { or: conditions }
}
