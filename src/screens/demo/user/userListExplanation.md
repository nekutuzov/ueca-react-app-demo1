# UECA Patterns In This Demo

This user management screen demonstrates UECA patterns for building data-driven list views with interactive tables:

## Table Component Integration

The `TableModel` component provides a powerful, declarative way to display tabular data with sorting, custom formatting, and interactive actions without managing complex state.

## Column Configuration

Table columns are defined in the `constr` hook (not `init`) to preserve column state (like sort order) across data refreshes. Each column can specify:
- **Field mapping**: Direct property access or computed values
- **Data types**: Built-in support for images, links, custom components
- **Sorting**: Enable/disable per column
- **Custom rendering**: `cellView` and `actionView` for complete control
- **Click routing**: Navigate on cell click with `route` parameter

## Dynamic Data Filtering

The screen demonstrates client-side filtering with the "Show only active users" checkbox. Filter state is managed reactively, and changing the filter automatically refreshes the table data.

## Action Buttons

The table includes:
- **Add New button**: Creates new user with ID "0" and navigates to editor
- **Row-level Edit button**: Uses `NavItem` for inline actions with active state tracking
- **Avatar links**: Clickable images that navigate to edit screen

## CRUD Screen View Mode

The screen uses `CRUDScreenModel` in "view" mode (intent: "view") which provides:
- Refresh button for reloading data
- Breadcrumb navigation
- Standardized toolbar layout
- No save/cancel buttons (viewing only, not editing)

## Message Bus API Integration

Data fetching uses `Api.GetUsers` via the message bus, demonstrating decoupled data access that allows easy mocking, caching, or API swapping.

## Reactive Data Binding

The checkbox uses bidirectional binding with `UECA.bind(() => model, "onlyActiveUsers")`, automatically synchronizing UI and model state without manual event handlers.

## Route Navigation

Multiple navigation patterns:
- Avatar images navigate on click via column route configuration
- Name cells are clickable links to edit screen
- Edit button uses `NavItem` with route integration
- Add New button programmatically navigates with `goToRoute()`

## Component Lifecycle Management

The `constr` hook sets up table columns once at construction, while `init` refreshes data on every mount, demonstrating proper separation of one-time setup vs. recurring initialization.

## Custom Cell Rendering

The Status column uses custom rendering to display "Active" in green or "Inactive" in red, showing how to add visual styling based on data values.

## Computed Fields

The Country column demonstrates computed field access: `field: (rec) => rec.address.country`, extracting nested properties for display without modifying the data model.

---

> **Try it:** Toggle "Show only active users" to filter the table. Click avatar images or names to navigate to edit screen. Use Edit buttons in the Actions column. Click "Add New" to create a user. Observe how the table count updates with filtering.
