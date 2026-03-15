# Code Ocean Frontend Challenge

A React application featuring two side-by-side virtualized infinite-scroll lists — **Users** and **Reviewers** — each with independent search, loaded from a local mock API.

---

## Getting Started

### 1. Start the API server

From the repo root:

```bash
npm install
npm start
```

This starts [json-server](https://github.com/typicode/json-server) on `http://localhost:3001`.

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Tech Stack

| Concern | Library | Reason |
|---|---|---|
| Build | [Vite](https://vite.dev) | Fast dev server and HMR out of the box |
| UI | [MUI v7](https://mui.com) | Comprehensive component library with a consistent design system |
| Data fetching | [TanStack Query v5](https://tanstack.com/query) | Built-in `useInfiniteQuery`, caching, and loading/error states |
| Virtualization | [react-window v2](https://github.com/bvaughn/react-window) | Renders only visible rows — scales to any number of items |
| Layout sizing | [react-virtualized-auto-sizer](https://github.com/bvaughn/react-virtualized-auto-sizer) | Feeds the container's pixel dimensions into react-window |

---

## Key Implementation Decisions

### Virtualized infinite scroll

`VirtualizedInfiniteList` uses `react-window`'s `List` with a fixed row height. As the user scrolls, `onRowsRendered` fires and triggers `fetchNextPage` when within 5 rows of the current tail — giving a smooth, ahead-of-time loading experience without any scroll event listeners.

A sentinel row (spinner) is appended to `rowCount` while the next page is in-flight, so the user sees immediate feedback before the data arrives.

### Search

Search is debounced by 400 ms (`useDebouncedValue`) before being sent to the API. The query key includes the debounced term, so TanStack Query automatically refetches and caches results per unique search. Changing the search term resets pagination to page 1.

The `_where` clause sent to json-server supports:
- Partial match on `firstName`, `lastName`, or `email`
- Full-name queries (`"Jane Doe"`) matched as `firstName contains "Jane" AND lastName contains "Doe"` (and the reverse)

### Responsive layout

On **desktop (≥ md)** the two lists are rendered side by side in a CSS grid. On **mobile** they collapse into a `Tabs` component so neither list is cramped.

### Tooltip-on-overflow

`TruncatedTooltip` wraps MUI's `Tooltip` and uses a `ResizeObserver` to show the tooltip only when the text is actually truncated — avoiding redundant tooltips on wide screens.

---

## Project Structure

```
src/
├── api/
│   ├── client.ts          # fetch wrapper + URL builder
│   ├── searchWhere.ts     # json-server _where clause builder
│   └── types.ts           # Person and paginated response types
├── components/
│   ├── lists/
│   │   └── VirtualizedInfiniteList.tsx   # generic virtualized list
│   ├── Layout/
│   │   └── UsersReviewersPanel.tsx       # side-by-side / tabbed layout
│   └── TruncatedTooltip.tsx              # tooltip shown only on overflow
├── features/
│   └── persons/
│       ├── PersonCard.tsx               # individual person row card
│       ├── PersonList.tsx               # search input + list wired together
│       └── useInfinitePersons.ts        # TanStack Query infinite fetching hook
├── hooks/
│   └── useDebouncedValue.ts
├── App.tsx
└── main.tsx
```
