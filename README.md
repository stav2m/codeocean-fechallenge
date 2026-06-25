# Virtualized Infinite Scroll — Users & Reviewers

A React + TypeScript application that renders two independent, **virtualized infinite-scroll** lists side by side. Each list lazy-loads data from its own API endpoint, has its own debounced server-side search, and is built to stay smooth even with an effectively unbounded number of items.

> Built as the Code Ocean Frontend Developer Challenge. The original challenge brief is preserved at [`CHALLENGE.md`](./CHALLENGE.md).

<p align="center">
  <img src="https://github.com/user-attachments/assets/7cf17e55-fbb7-456b-9479-035ca1310a97" width="70%" />
</p>

---

## Highlights

- **True virtualization** — only the rows visible in the viewport are mounted, so memory and DOM size stay constant whether the dataset has 100 or 1,000,000 rows.
- **Ahead-of-time infinite loading** — the next page is prefetched before the user reaches the bottom, so scrolling never stalls on a spinner.
- **Server-side search** — filtering by name *or* email happens on the API (debounced), not by loading everything into the browser.
- **Fully typed, generic, and reusable** — the same list, search, and data-fetching code powers both Users and Reviewers; adding a third list is a few lines.
- **Production-minded UX** — explicit loading, empty, and error states, an error boundary, responsive layout, and tooltip-on-overflow for long content.

---

## Quick Start

The project has two parts: a mock API at the repo root and the React app in [`frontend/`](./frontend).

```bash
# 1. Start the mock API (http://localhost:3001)
npm install
npm start

# 2. In a second terminal, start the app (http://localhost:5173)
cd frontend
npm install
npm run dev
```

Then open **http://localhost:5173**.

> The API is a [json-server](https://github.com/typicode/json-server) instance exposing `/users` and `/reviewers` with pagination and filtering.

---

## Tech Stack

| Concern | Choice | Why |
|---|---|---|
| Language | **TypeScript** | End-to-end type safety across API, hooks, and components |
| Build | **Vite** | Instant dev server and HMR |
| UI | **MUI v7** | Consistent, accessible design system out of the box |
| Data fetching | **TanStack Query v5** | `useInfiniteQuery` gives caching, pagination, and request state for free |
| Virtualization | **react-window v2** | Renders only visible rows — the core of the scalability requirement |
| Sizing | **react-virtualized-auto-sizer** | Feeds live container dimensions into the virtual list |

---

## Architecture

The app is organized so that everything list-related is **generic and shared**, while the only domain-specific pieces are a thin configuration layer.

```
frontend/src/
├── api/
│   ├── client.ts          # typed fetch wrapper + paginated URL builder
│   ├── searchWhere.ts     # builds the json-server filter from a search term
│   └── types.ts           # Person + paginated response types
├── components/
│   ├── lists/
│   │   └── VirtualizedInfiniteList.tsx   # generic virtualized + infinite list
│   ├── Layout/
│   │   └── UsersReviewersPanel.tsx       # side-by-side (desktop) / tabbed (mobile)
│   ├── TruncatedTooltip.tsx              # tooltip shown only when text overflows
│   └── ErrorBoundary.tsx                 # catches render-time failures
├── features/persons/
│   ├── PersonList.tsx        # search box + list, wired together
│   ├── PersonCard.tsx        # a single row
│   └── useInfinitePersons.ts # TanStack Query infinite-fetch hook
├── hooks/useDebouncedValue.ts
├── App.tsx
└── main.tsx
```

### How the two lists reuse one implementation

`PersonList`, `VirtualizedInfiniteList`, and `useInfinitePersons` know nothing about "users" or "reviewers" — they take an endpoint and render whatever comes back. `App` mounts the same component twice with different endpoints, which is exactly the "reuse the code you've created" requirement, taken to its logical conclusion.

---

## Design Decisions

### Virtualized infinite scroll
The list uses `react-window`'s windowing with a fixed row height. As the user scrolls, `onRowsRendered` checks how close the rendered range is to the tail and triggers `fetchNextPage` while still **5 rows away** — so the next page is usually already in cache by the time it's needed. A sentinel spinner row is appended while a page is in flight, giving instant feedback without any manual scroll listeners.

### Debounced, server-side search
The search term is debounced (400 ms) and pushed into the TanStack Query key. Because the key changes, Query automatically refetches, resets pagination, and caches results per unique term. Searching supports partial matches on first name, last name, and email, plus full-name queries like `"Jane Doe"`.

### Resilient, friendly states
Every list independently handles **loading**, **empty**, and **error** states, and the whole tree is wrapped in an `ErrorBoundary` so a render failure degrades gracefully instead of blanking the page.

### Responsive layout
On desktop the two lists sit side by side in a CSS grid; on mobile they collapse into tabs so neither list feels cramped.

---

## Scalability

The scalability requirement is met structurally rather than by tuning:

- **DOM stays flat** — windowing keeps the number of mounted rows proportional to the viewport, not the dataset.
- **Network stays paged** — data is fetched in pages on demand and cached, never all at once.
- **Search stays on the server** — the browser never holds the full dataset in memory to filter it.

The result is the same smooth experience whether the API returns a few hundred records or millions.

---

## Possible Next Steps

- Unit tests for the search-clause builder and the infinite-fetch hook, plus a virtualization smoke test.
- Variable row heights (measured) for richer cards.
- URL-synced search state for shareable/deep-linkable views.
