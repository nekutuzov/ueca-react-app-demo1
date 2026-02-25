# Chart Management Screen

This screen demonstrates a complete CRUD (Create, Read, Update, Delete) implementation for managing charts in the application.

## Screen Purpose

The Chart List Screen provides a comprehensive interface for:
- Viewing all available charts in a sortable, filterable table
- Creating new charts with the "Add New Chart" button
- Editing existing charts by clicking on titles or action buttons
- Managing chart data and configurations

## Key Components

### CRUD Screen Pattern

This screen uses the **CRUD Screen** component (`useCRUDScreen`), which provides:
- **Breadcrumb navigation**: Shows current location in the app hierarchy
- **Refresh functionality**: Reloads data from the API
- **Consistent layout**: Standard screen structure with header and content area
- **Intent-based behavior**: Configured with `intent: "view"` for list display

### Data Table

The table component (`useTable`) displays chart data with:
- **Sortable columns**: Click column headers to sort (Title, Type, Data Points, Created)
- **Custom cell rendering**: Special formatting for type badges and empty descriptions
- **Navigation integration**: Click chart titles to open detail/edit view
- **Responsive layout**: Fixed width columns with horizontal scrolling if needed

### Table Columns

**Title** (300px):
- Primary identifier for the chart
- Clickable - navigates to chart editor
- Sortable alphabetically

**Type** (150px):
- Chart type: `pie`, `line`, `scatter`, or `bar`
- Capitalized display with medium font weight
- Sortable by type

**Description** (400px):
- Optional descriptive text
- Shows "No description" in italic gray if empty
- Not sortable

**Data Points** (120px):
- Count of data points in the chart
- Computed field from data array length
- Center-aligned, sortable

**Created** (180px):
- Timestamp of chart creation
- Formatted as datetime
- Sortable chronologically

**Actions** (50px):
- Edit icon button
- Highlights when row is active
- Navigates to chart editor

## Data Flow

### Loading Data

When the screen initializes:
1. `init` hook runs and calls `crudScreen.refresh()`
2. `doOnRefresh` method executes
3. Sends `"Api.GetCharts"` message via message bus
4. API client returns chart array
5. Table data updates, triggering UI refresh

### Creating New Charts

Clicking "Add New Chart" button:
1. Navigates to `/charts/:id` with `id: "0"`
2. Chart editor screen opens in create mode
3. User configures new chart
4. On save, redirects back to list
5. List refreshes automatically via `init` hook

### Editing Charts

Clicking a chart title or edit button:
1. Navigates to `/charts/:id` with actual chart ID
2. Chart editor loads existing chart data
3. User modifies chart properties
4. On save, updates backend and returns to list
5. List refreshes to show updated data

## Technical Implementation

### Component Lifecycle

**`constr` Hook**:
- Sets up table columns configuration
- Runs once when model is first created
- Prevents column configuration loss on refreshes

**`init` Hook**:
- Triggers data refresh
- Runs when component activates (including after cache retrieval)
- Ensures latest data is always displayed

### Message Bus Pattern

The screen uses message bus for API communication:
```typescript
model.bus.unicast("Api.GetCharts", undefined)
```

This pattern:
- Decouples screen from API client implementation
- Allows API mocking for development/testing
- Enables centralized error handling
- Supports request/response logging

### Routing Integration

Chart navigation uses typed routes:
```typescript
{ path: "/charts/:id", params: { id: "0" } }  // New chart
{ path: "/charts/:id", params: { id: chartId } }  // Edit chart
```

Benefits:
- Type-safe route parameters
- Compile-time validation
- Automatic URL generation
- Browser history integration

## Try It

1. **Sort the table**: Click any sortable column header to sort ascending/descending
2. **Create a chart**: Click "Add New Chart" to open the chart editor
3. **Edit a chart**: Click any chart title or edit button to modify it
4. **Observe refresh**: After editing, the list automatically refreshes with updated data

## Related Screens

- **Chart Editor** (`/charts/:id`): Create and edit individual charts
- **Dashboard** (`/dashboard`): View charts in a dashboard layout
- **Home** (`/home`): Application overview with architecture diagram
