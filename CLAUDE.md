# UECA React Application - AI Coding Agent Instructions

This is a demo application built on **UECA-React 3.0** (`ueca-react` npm package) — a framework that
replaces React patterns with a component model of structured props, children, methods, events and
message-bus communication.

## Start here: the library skills

The library ships its own agent skills, copied into `.claude/skills/` by the `postinstall` script.
**They are the authority on the framework itself** — this file only covers what is specific to *this*
application.

- Invoke **`ueca-app-development`** before creating or changing any component, screen or service. It
  carries the component pattern (struct → hook → `getFC`), state and bindings, lifecycle, model
  caching, the message bus, the complete public API, and a symptom-indexed list of the mistakes that
  fail *silently*.
- Invoke **`ueca-app-architecture`** for anything bigger than one component: the app shell, routing,
  services, "where does this go", or converting React code to UECA.

Where this file and a skill disagree about the **framework**, the skill wins. Where they disagree
about **this app's conventions** (base hooks, layout primitives, MUI wrapping, screen patterns), this
file wins.

`.claude/skills/` is generated — it is gitignored and re-copied on every `npm install`. Never edit it
in place; after upgrading `ueca-react`, run `npm install` to refresh it.

### Library reference docs

Shipped inside the package (paths are real — verify before citing):

- Index: `node_modules/ueca-react/docs/raw/index.md`
- Guides: `node_modules/ueca-react/docs/raw/original/*.md` — including *Introduction to UECA-React*,
  *Component Mental Model*, *Component Integration Model*, *Lifecycle Hooks*, *State Management*,
  *Property Bindings*, *Automatic onChange Events*, *Automatic onChanging Events*, *Message Bus*,
  *Model Caching*, *Component Extension*, *Component IDs*, *Error Handling*, *Arrays and Reactivity*,
  *Tracing*, *Utility Functions*
- Changelog (read this before assuming any v2 behaviour still holds):
  `node_modules/ueca-react/CHANGELOG.md`

## v3 rules that bite

v3 turned a set of previously-silent mistakes into **throws**, so they now reach
`globalSettings.errorHandler` instead of scrolling past in a console. The full list is in the
changelog and in the skill's pitfalls reference; these are the ones this codebase touches:

- **A message with no `in` payload takes no argument.** `unicast("BusyDisplay.Clear")` — the v2
  placeholder `unicast("Msg", undefined)` is now a compile error.
- **`unicast` and `castTo` expect exactly one subscriber** and throw *before dispatching* if more than
  one matches. Use `broadcast` when a fan-out is intended. Zero subscribers is not an error —
  `unicast` returns `undefined`, which is why an ordering bug looks like a missing value rather than a
  crash (see *Startup ordering* below).
- **`draw` and `erase` must be synchronous.** Move async work to `mount` / `unmount`.
- **`id` and `cacheable` are system props.** No binding, no getter, and no synthesized
  `onChangeId` / `onChangingId` / `onChange…Cacheable`.
- **Two JSX siblings may not share an `id`.** An `id` is identity, cache key, bus address and DOM id at
  once. Derive a list child's id from its item — see `table.tsx`, which builds
  `` `navCell_${column.field}_${dataRecord.index}` ``.
- **A param may not switch between a binding and a value between renders.** Put the condition inside
  the getter, never a conditional `UECA.bind(...)` in JSX.
- **Assigning to a declared method or a child model throws.** Assign to a prop instead.
- **`children`-section constants are initial values only** — they are no longer re-asserted when a
  cached model remounts. A value that must keep tracking its source needs a getter or a `bind(...)`.
  JSX props are standing declarations and *are* re-applied every render.
- `modelCacheMode` values are `"no-cache" | "cache" | "auto-cache"` (default `"auto-cache"`).
- `hashHtmlId` is read from `globalSettings`, not from `window`.
- **`React.StrictMode` is supported** as of v3. This app still does not enable it (see
  `appStart.tsx`) — it buys a UECA app nothing.

## Debugging: use the trace, not guesswork

Most UECA failures are silent — no error, just a view that never updates or a handler that never runs.
**A render failure is invisible with tracing off**: the component renders as `null`.

```ts
UECA.globalSettings.traceLog = true;              // src/main.tsx, off by default
```

…or from a devtools console with no rebuild:

```js
window.UECA.traceLog = true;
window.UECA.tracing = { capture: 5000 };
window.UECA.trace.save("trace.json");             // reopen in the trace viewer
```

`<UECA.TraceViewerButton/>` is mounted in `appUI.tsx`. It opens the viewer in its own window, falling
back to an in-page overlay when the popup is blocked, and is a lazily-loaded chunk — a closed viewer
costs the bundle nothing. Five views over one trace: Table, Timeline, Sequence, Tree and Graph.

A trace record names its model, path, owner and cache, which way a binding carried, and which of
`broadcast` / `castTo` / `unicast` sent a message — enough to tell "the source never changed" from
"the change never arrived".

## Startup ordering (learned the hard way)

**`init` hooks are not ordered between models, and an `async init` yields.** A model that another
model's `init` depends on may not have finished its own.

`AppBrowsingHistory` establishes the active path in **`constr`**, not `init`, precisely because
`AppRouter.init` reads it over the bus to resolve the startup route. When that work lived in an
`async init` (which awaited `App.GetInfo` first), the router asked for a path that had not been
computed yet, got `undefined` back from a zero-subscriber `unicast`, and dropped **every deep link
onto the default screen**.

The rule: **if another model's `init` reads it, produce it in `constr`** — and derive it from
something synchronously available (here, `window.location`) rather than from an awaited message.
`constr` also runs exactly once, so DOM listeners registered there are not re-registered when a cached
model reactivates.

Relatedly, `main.tsx` **awaits** `initMocks()` before `runApplication()`. A deep link such as
`/charts` issues its API call during startup, and a request made before the MSW worker intercepts
reaches the dev server as a 404.

## Architecture of this app

### Technology stack

- **UECA-React 3.0** (`ueca-react`) — the component model, message bus, bindings, tracing
- **TypeScript** + **JSX**; **React 19** used only for the model-instantiation hook
- **MobX** — powers reactivity, fully abstracted by UECA; never import it (use `UECA.observe`)
- **Material-UI v7** — always wrapped, never used directly (see *MUI wrapping* below)
- **MSW** — API mocking in development

**Banned React features**: `useState`, `useEffect`, `useContext`, `useReducer`, `useRef`, `useMemo`,
`useCallback`, class components, direct DOM access outside `draw` / `mount`.

### Base component hierarchy

Every component extends one of these, in `src/components/base/`:

| Base | Use for |
| --- | --- |
| `BaseModel` / `useBase` | core: routing, dialog, alert, busy-display shortcut methods |
| `UIBaseModel` / `useUIBase` | visual components |
| `EditBaseModel` / `useEditBase` | form/editing components with validation |
| `MuiBaseModel` / `useMuiBase` | Material-UI wrappers |
| `MuiEditBaseModel` / `useMuiEditBase` | MUI form controls |
| `RouteScreenBaseModel` / `useRouteScreenBase` | screen-level components with routing |

`useBase` gives every model shorthand methods over the bus — `goToRoute`, `dialogWarning`,
`dialogConfirmDelete`, `alertSuccess`, `setAppBusy`, `selectFiles`,
`runWithErrorDisplay`, `runWithBusyDisplay`. **Prefer these over hand-written `bus.unicast` calls.**

### Component file rules

1. One component per file. Never two.
2. Export exactly `XxxModel`, `XxxParams`, `useXxx`, `Xxx`.
3. `id: useXxx.name` in `props`, and `id={model.htmlId()}` on the root JSX element (the selector UI
   tests use).
4. Keep interfaces minimal — pass a domain object (`Chart`, `User`), not fifteen decomposed props.
   Handle data transformation *inside* the component.
5. Keep `View` structural; move algorithmic logic into module-level `_privateFunctions`.
6. Don't supply `|| default` fallbacks for wrapped-component props — let the component own its
   defaults. Exceptions: user-facing placeholder text, business logic that needs a guaranteed value.

### Layout primitives

Use `Col`, `Row`, `Block` from `@components` — never a raw `<div>`. For text use MUI's `Typography`
(imported directly from `@mui/material`), never `<h1>` / `<p>`: stateless MUI primitives are the one
exception to the wrapping rule below, and `Typography` is used this way throughout the screens.

### MUI wrapping

Third-party components are never used directly in application code. A wrapper extends `MuiBaseStruct`
with the MUI props type as its second generic, and spreads `{...model.mui}` — the backdoor to every
native MUI prop. Declare `ReactElement` props as `[PropertyName]View`. Follow
`src/components/mui/button.tsx`.

### Screens

- `CrudScreen` (`src/screens/layout/crudScreen.tsx`) — save/cancel/delete/refresh/validation
  workflow. It subscribes to `App.Router.BeforeRouteChange` to guard unsaved changes.
- `TabsScreen` — `CrudScreen` plus a tab container.
- Demo screens: `src/screens/demo/{dashboard,user,chart}`
- Tutorials: `src/screens/tutorial/{toolbar,bindings,messageBus,autoEvents}` — each pairs an
  interactive panel with an explanation `.md` and a live action log.

### Messages, routing, API

- Message catalogue: `src/core/infrastructure/appMessage.ts`. A message with no `in` is
  `UECA.EmptyObject` and takes **no argument** when posted.
- Routes: `src/core/infrastructure/appRoutes.tsx`, resolved by `AppRouter`, with `AppLayout`
  (sidebar/nav) and `OtherLayout` (minimal) selected per route.
- API: service clients are ordinary components with `messages:` handlers and no view
  (`src/api/demoServiceApiClient.tsx`). Screens reach them over the bus, never by import.
- Errors: `UECA.globalSettings.errorHandler` catches everything (set in `appStart.tsx`), so
  `try/catch` in hooks, methods and events is unnecessary.

### Path aliases

`@components` → `src/components`, `@core` → `src/core`, `@api` → `src/api`, `@screens` →
`src/screens`. Declared in `tsconfig.app.json`, resolved by `vite-tsconfig-paths`.

TypeScript runs with `strictNullChecks: false` and `noImplicitAny: false` — every model prop is
`T | undefined`, so read defensively (`model.items?.length ?? 0`).

## Development workflows

| Command | Does |
| --- | --- |
| `npm run dev` | Vite on port **5001**, base path `/ueca-react-app-demo1/` |
| `npm run build` | `tsc -b && vite build` |
| `npm run lint` | ESLint |
| `npm install` | installs deps **and** refreshes `.claude/skills/` via `postinstall` |

The app is served under a base path, and `index.html` sets `<base href="/ueca-react-app-demo1/">`.
Asset references in `index.html` must be **relative** (`href="ueca.ico"`) so they resolve against it
in dev and on GitHub Pages alike.

**API mocking**: MSW handlers in `src/api/mocks/handlers.ts`, fixtures in `src/api/mocks/*.json`,
worker at `public/mockServiceWorker.js`. Disable by removing the `await initMocks()` call in
`src/main.tsx`.

**Verifying UI changes**: tables are virtualized (`react-virtuoso`) and screens load data
asynchronously, so a screenshot taken immediately after navigation catches a half-settled layout.
Allow the page to settle, and confirm content by querying the DOM rather than by reading a downscaled
screenshot.
