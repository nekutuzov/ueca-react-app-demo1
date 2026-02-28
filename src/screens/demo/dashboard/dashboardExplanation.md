# UECA Patterns In This Demo

This dashboard screen demonstrates several UECA patterns for building data visualization components:

## Domain Object Interfaces

The chart components use clean encapsulated interfaces by accepting complete `Chart` objects rather than dozens of individual properties. This follows UECA's principle of minimal, cohesive interfaces.

## Reactive Data Binding

Chart data updates automatically when users are fetched from the API. Direct property assignment (`model.usersByCountryChart.data = countryChartData`) triggers reactive re-renders without explicit setState calls.

## Message Bus API Integration

The dashboard uses `model.bus.unicast("Api.GetUsers")` to fetch data via the message bus, demonstrating decoupled communication between screens and API services.

## Component Encapsulation

Each card is a self-contained component with its own title, subtitle, and body content. The chart components manage their internal complexity (data transformation, rendering) while exposing clean interfaces.

## Data Transformation Methods

Private methods like `_generateCountryChartData` and `_generateStatusChartData` encapsulate algorithmic logic outside of JSX, keeping the view layer clean and structural.

## CRUD Screen Integration

The dashboard uses the `CRUDScreenModel` pattern, which provides built-in refresh functionality and standardized toolbar integration.

## Chart Configuration

Chart components accept complete configuration objects (`pieChartConfig`) with properties like `innerRadius`, `outerRadius`, `showLegend`, and `legendPosition`. The components handle all the complexity of rendering while the parent just provides configuration.

## Clickable Cards

Cards use the `clickable` and `onClick` properties to navigate to related screens, demonstrating declarative event handling patterns.

---

> **Try it:** Click the Refresh button to reload user data. Click on the cards to navigate to the User Management screen. Observe how the chart data updates automatically when new data is loaded.
