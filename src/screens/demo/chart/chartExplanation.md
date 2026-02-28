# UECA Patterns In This Demo

This chart editor screen demonstrates advanced UECA patterns for building complex form-based applications with dynamic UI:

## Dynamic Component Rendering

The screen dynamically switches between different chart types (pie, line, scatter, bar) using conditional rendering methods like `_renderChartPreview()` and `_renderChartSettings()`. This shows how UECA components can adapt their UI based on state.

## Bidirectional Bindings

Form fields use `UECA.bind()` to create bidirectional synchronization between the UI and the chart data model. Changes in text fields or selects automatically update the chart object and vice versa.

## CRUD Screen Pattern

The screen uses `CRUDScreenModel` to provide standardized create/read/update/delete operations with built-in save/cancel/delete/refresh buttons and validation workflows.

## Validation Integration

The `modelsToValidate` array automatically integrates field-level validation (required fields) with the CRUD screen's save workflow, preventing invalid data from being saved.

## Type-Specific Configuration

Each chart type has its own configuration object (`pieChartConfig`, `lineChartConfig`, etc.) with type-specific settings. The settings panels dynamically show only relevant controls for the selected chart type.

## Real-Time Preview

The chart preview updates automatically as you modify settings, demonstrating reactive state management. Direct property assignments trigger chart re-renders without explicit update calls.

## Route Parameter Integration

The screen reads chart ID from route parameters (`/charts/:id`) and handles both new chart creation (ID "0") and existing chart editing with proper navigation after saves.

## Message Bus CRUD Operations

All API operations use the message bus pattern:
- `Api.GetChart` - Fetch chart data
- `Api.CreateChart` - Save new chart
- `Api.UpdateChart` - Update existing chart  
- `Api.DeleteChart` - Remove chart

## Conditional Field Behavior

The chart type selector is disabled for existing charts (not new) to prevent breaking changes, demonstrating conditional UI based on screen state.

## Split Panel Layout

The screen uses a split layout with chart preview on the left and settings on the right, showing how UECA's layout primitives (`Row`, `Col`, `Block`) create sophisticated UIs.

---

> **Try it:** Change chart settings and watch the preview update in real-time. Switch between chart types when creating a new chart. Modify settings and use Save/Cancel/Delete buttons to test the CRUD workflow.
