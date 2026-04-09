# UECA React Application - AI Coding Agent Instructions

## Architecture Overview

This is a **UECA (Unified Encapsulated Component Architecture)** React application - a framework that abstracts React patterns into a component model with structured props, children, methods, events, and message bus communication. UECA replaces standard React patterns with a unified component structure that emphasizes declarative composition and message-based communication.

### Learning Resources

**For New Developers**:
1. Start with UECA documentation: `node_modules/ueca-react/docs/index.md`
2. Review tutorial screens in `src/screens/tutorial/` for interactive examples
3. Study component patterns in `src/components/base/` for base architectures
4. Examine demo screens in `src/screens/demo/` for full-featured implementations

**Key Documentation Files**:
- **Introduction**: `docs/Introduction to UECA-React.md` - Framework overview and philosophy
- **Component Model**: `docs/Component Mental Model in UECA-React.md` - Black box component architecture
- **Integration**: `docs/Component Integration Model in UECA-React.md` - Parent-child communication patterns
- **Lifecycle**: `docs/Lifecycle Hooks in UECA-React.md` - Component initialization and cleanup
- **State**: `docs/State Management in UECA-React.md` - MobX-powered reactive properties
- **Bindings**: `docs/Property Bindings in UECA-React.md` - Unidirectional, bidirectional, custom bindings
- **Events**: `docs/Automatic onChange Events in UECA-React.md` - Auto-generated property events
- **Message Bus**: `docs/Message Bus in UECA-React.md` - Decoupled component communication

### Component Mental Model

Components in UECA are **self-contained black boxes** with:
- **Internal State** (props): Encapsulated properties accessible and modifiable
- **Methods**: Functions to alter state, retrieve data, trigger events
- **Internal Events**: Automatic `onChange<Prop>` and `onChanging<Prop>` events
- **Children**: Recursive component structure (children follow same principles)
- **Message Bus**: Decoupled inter-component communication
- **View**: JSX presentation (if visual component)

### Technology Stack

- **UECA-React 2.0**: Framework installed as npm package `ueca-react`
  - Documentation: `node_modules/ueca-react/docs/` (comprehensive guides on all patterns)
  - Core patterns: Component model, lifecycle hooks, message bus, property bindings, automatic events
- **TypeScript**: Core language for type safety and maintainability
- **JSX**: UI description integrated with TypeScript
- **React 19.0**: Minimal usage - only custom hooks for model instantiation
- **MobX**: Powers reactive state management (abstracted by UECA)
- **Material-UI v7**: Wrapped components (never used directly)
- **MSW**: API mocking in development

**Banned React Features**: `useState`, `useEffect`, `useContext`, `useReducer`, class components

**UECA Documentation References**:
- Index: `node_modules/ueca-react/docs/index.md`
- Component Mental Model: `node_modules/ueca-react/docs/Component Mental Model in UECA-React.md`
- Lifecycle Hooks: `node_modules/ueca-react/docs/Lifecycle Hooks in UECA-React.md`
- Message Bus: `node_modules/ueca-react/docs/Message Bus in UECA-React.md`
- Property Bindings: `node_modules/ueca-react/docs/Property Bindings in UECA-React.md`
- State Management: `node_modules/ueca-react/docs/State Management in UECA-React.md`
- Automatic Events: `node_modules/ueca-react/docs/Automatic onChange Events in UECA-React.md`

### Key Architectural Patterns

**Component Model Structure**: All components follow the UECA pattern using `useXXX` hooks that return models with structured schemas:
```tsx
// Standard UECA component pattern
type ComponentStruct = UECA.ComponentStruct<{
    props: { /* state properties */ },
    children: { /* child components */ },
    methods: { /* component methods */ },
    events: { /* event handlers */ }
}, AppMessage>;

function useComponent(params?: ComponentParams): ComponentModel {
    const struct: ComponentStruct = {
        props: { id: useComponent.name },
        // lifecycle hooks: constr, init, deinit, mount, unmount, draw, erase
        View: () => <div id={model.htmlId()}>{/* JSX */}</div>
    };
    const model = UECA.useComponent(struct, params);
    return model;
}
```

**Message Bus Communication**: Components communicate via typed message bus instead of prop drilling:
```tsx
// Message definitions in src/core/infrastructure/appMessage.ts
type AppMessage = {
    "Api.GetUsers": { out: User[] };
    "Dialog.Warning": { in: { title?: string, message: string } };
};

// Posting messages (three methods)
await model.bus.unicast("Api.GetUsers");  // First subscriber handles
await model.bus.broadcast("*.Input", "UI.Validate");  // All matching subscribers
await model.bus.castTo("app.form.button", "Click");  // Specific component by fullId

// Handling messages in component struct
messages: {
    "Api.GetUsers": async () => {
        return await apiClient.get<User[]>("/users");
    }
}
```

**Component Integration Patterns**:
- **Direct Model Calls**: Parent → Child (hierarchical, inward only) - for building component blocks
- **Message Bus**: Any → Any (decoupled) - for API calls, dialogs, cross-component events
- **Never** call parent from child directly - use message bus or events instead

**Path Aliases** (critical for imports):
- `@components` → `src/components`
- `@core` → `src/core` 
- `@api` → `src/api`
- `@screens` → `src/screens`
- `ueca-react` → npm package (installed via package.json)

Configured in `tsconfig.app.json` paths and resolved by `vite-tsconfig-paths` plugin.

**TypeScript Config**:
- `strictNullChecks: false` - UECA handles undefined gracefully
- `noImplicitAny: false` - Flexibility for dynamic patterns
- `erasableSyntaxOnly: false` - Enum support enabled

**Base Component Hierarchy**: All components extend from base classes in `src/components/base/`:
- `BaseModel` - Core UECA functionality with routing/dialog shortcuts
- `UIBaseModel` - UI-focused components  
- `EditBaseModel` - Form/editing components with validation
- `RouteScreenBaseModel` - Screen-level components with routing
- `MuiBaseModel` - Material-UI component wrappers (see MUI Integration below)

## Development Workflows

**Development Server**: `npm run dev` (Vite on port 5001, base path `/myapp`)
**Production Build**: `npm run build` (TypeScript compilation + Vite build)
**Linting**: `npm run lint` (ESLint with TypeScript support)
**Package Management**: `npm install` to install all dependencies including `ueca-react@^2.0.1`

**API Mocking**: MSW (Mock Service Worker) configured in `src/api/mocks/handlers.ts`:
- Enable/disable: Comment/uncomment `initMocks()` in `src/main.tsx`
- Mock data: `src/api/mocks/*.json` files (users.json, charts.json)
- Service worker: `public/mockServiceWorker.js` (served at `/myapp/mockServiceWorker.js`)
- Handlers intercept requests matching `apiBaseUrl` pattern without code changes

**Component Creation Pattern** (follow exactly):
1. **Structure Definition**: Define `XxxStruct` type extending appropriate base (BaseStruct, UIBaseStruct, EditBaseStruct, MuiBaseStruct)
2. **Type Aliases**: Create `XxxParams` and `XxxModel` type aliases
3. **Hook Implementation**: Create `useXxx` hook with structured implementation
4. **Functional Component**: Export `Xxx` component using `getFC(useXxx)`
5. **Exports**: Always export `XxxModel`, `XxxParams`, `useXxx`, and `Xxx` component
6. **Component ID**: Always set `id: useXxx.name` in props for debugging/caching
7. **DOM IDs**: Use `model.htmlId()` for root element `id` attribute
8. **One File Per Component**: Strict rule - never define multiple components in one file
9. **Keep interfaces minimal** - prefer domain objects over individual properties
10. **Encapsulate complexity** - handle data transformations internally, not in consuming components

**Component Structure Example**:
```tsx
import * as UECA from "ueca-react";
import { UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";

type MyComponentStruct = UIBaseStruct<{
    props: {
        value: string;
    };
    children: {
        // child components
    };
    methods: {
        // component methods
    };
    events: {
        onChange: (value: string) => void;
    };
}>;

type MyComponentParams = UIBaseParams<MyComponentStruct>;
type MyComponentModel = UIBaseModel<MyComponentStruct>;

function useMyComponent(params?: MyComponentParams): MyComponentModel {
    const struct: MyComponentStruct = {
        props: {
            id: useMyComponent.name,
            value: "",
        },
        
        children: {
            // initialize children
        },
        
        methods: {
            // implement methods
        },
        
        View: () => <div id={model.htmlId()}>{model.value}</div>
    };
    
    const model = useUIBase(struct, params);
    return model;
}

const MyComponent = UECA.getFC(useMyComponent);

export { MyComponentModel, MyComponentParams, useMyComponent, MyComponent };
```

**Component IDs** (critical for debugging/testing):
- **`model.id`**: Component's unique identifier (typically hook name)
- **`model.fullId()`**: Hierarchical path (e.g., `"app.ui.form.button"`)
- **`model.htmlId()`**: DOM-compatible ID for root element
- **`model.birthMark()`**: Unique instance identifier across cache cycles
- **Always set** `id={model.htmlId()}` on top-level JSX element
- **Automated testing**: Use `htmlId()` as selector in UI testing tools

**Screen Development**: Use `CrudScreen` pattern from `src/screens/layout/crudScreen.tsx` for data management screens with built-in save/cancel/validation workflows. Complete CRUD operations supported:
- **Create**: New entity creation with validation and API integration
- **Read**: Data fetching and display with error handling
- **Update**: In-place editing with change tracking and validation
- **Delete**: Entity deletion with proper navigation and cleanup

**Tutorial Screens** (`src/screens/tutorial/`): Interactive examples demonstrating UECA patterns
- **Toolbar** (`tutorial/toolbar/`): Button interactions, event propagation, reactive state, action logging
- **Bindings** (`tutorial/bindings/`): Property bindings (unidirectional, bidirectional, custom), two-way sync
- **Message Bus** (`tutorial/messageBus/`): Component communication via typed messages, unicast/broadcast patterns
- **Auto Events** (`tutorial/autoEvents/`): Automatic onChange/onChanging events, property validation
- Each tutorial includes:
  - Interactive panel component demonstrating patterns
  - Screen component integrating the panel
  - Explanation markdown (`.md`) describing concepts
  - Action log viewer showing real-time interactions

**Advanced Example** (`src/screens/zipCodeLookup/`): Zip code lookup with auto events
- Demonstrates onChanging event for input validation (numeric-only)
- Shows onChange event for API trigger and cascading updates
- Real-time property change logging with old/new value tracking
- Pattern for form validation and data transformation

**Demo Screens** (`src/screens/demo/`): Full-featured examples
- **Dashboard**: Cards, charts, data visualization
- **User Management**: CRUD operations, table with actions, form validation
- **Chart Management**: Chart editor with type-specific settings, preview

**API Integration**: Follow `src/api/demoServiceApiClient.tsx` pattern - use message bus handlers, not direct imports.

## Critical Conventions

**No React.StrictMode**: Explicitly avoided due to UECA lifecycle conflicts (see `src/core/infrastructure/appStart.tsx`)

**Lifecycle Hooks**: Use UECA hooks instead of useEffect (all receive `model` parameter):
- `constr(model)` - one-time setup when model instantiated (before `init`)
- `init(model)` - called on creation or cache retrieval (setup subscriptions)
- `mount(model)` - when component attaches to DOM (add DOM listeners)
- `draw(model)` - after view rendering (adjust UI positions)
- `erase(model)` - before UI removal (clear animations)
- `unmount(model)` - when component detaches from DOM (remove listeners)
- `deinit(model)` - when component loses React context (cleanup subscriptions)

**Execution Order**: `constr` → `init` → `mount` → `draw` → `erase` → `unmount` → `deinit`

**Hook Chaining**: Hooks passed in JSX params chain with model-defined hooks (model hook executes first)

**State Management**: Direct property assignment (MobX-powered):
```tsx
model.count++; // triggers reactive updates
model.user = newUser; // no setState needed
// Components manage their own state - assign directly to child properties
model.userCountCard.value = users?.length || 0;
```

**Component State Encapsulation**: Components should manage their own state internally. Parent components should avoid exposing child component state as their own properties unless that state needs to be shared across multiple children or used for parent-level logic.

**Proper Encapsulation Principles** (critical UECA pattern):
- **Single Responsibility**: Components should accept minimal, cohesive data objects rather than many individual properties
- **Internal Complexity Management**: Complex data transformations and logic should be handled inside components, not exposed to consumers
- **Clean Interfaces**: Prefer passing domain objects (like `Chart`, `User`) rather than decomposing into dozens of individual props
- **Avoid Property Explosion**: If a component needs 10+ props, consider encapsulating related data into objects
```tsx
// ❌ Poor encapsulation - violates UECA principles
useChart({
    title: "...", data: [...], showGrid: true, showLegend: true,
    legendDirection: "vertical", xAxisLabel: "...", yAxisLabel: "...",
    // ...15+ more individual properties
})

// ✅ Proper UECA encapsulation
useChart({
    chart: () => model.chart  // Single domain object
})
```

**Property Bindings**: Three types for parent-child data flow:
```tsx
// 1. Unidirectional (read-only) - arrow function returning value
disabled: () => model.isLoading

// 2. Bidirectional - synchronizes state in both directions
value: UECA.bind(() => model.formData, "username")

// 3. Custom - transform values during binding
phone: UECA.bind(
    () => _formatPhone(model.phoneDigits),  // getter: format for display
    (val) => model.phoneDigits = _stripFormat(val)  // setter: store as digits
)
```

**When to Use**:
- Unidirectional: Display-only props, computed values, read-only state
- Bidirectional: Form inputs, two-way sync between parent/child
- Custom: Data transformation (formatting, validation, type conversion)

**Avoid External Default Values** (critical anti-pattern):
- **Let Components Handle Defaults**: React/MUI components should manage their own default values internally
- **Don't Use `|| defaults` Pattern**: Avoid providing fallback values unless specifically needed for business logic
- **Trust Component Design**: Well-designed components handle undefined props gracefully
```tsx
// ❌ Anti-pattern - external defaults
<MUIChart 
    margin={config.margin || { top: 50, right: 50, bottom: 50, left: 50 }}
    showGrid={config.showGrid || true}
    layout={config.layout || "vertical"}
/>

// ✅ Correct pattern - let component handle defaults
<MUIChart 
    margin={{ ...config.margin }}
    showGrid={config.showGrid}
    layout={config.layout}
/>
```
**When External Defaults ARE Needed**:
- User-facing displays (placeholder text in UI fields)
- Business logic decisions (when consuming code needs guaranteed non-undefined values)
- API contracts (when processing requires specific values)

**Centralized Error Handling**: All errors (sync/async) caught by `UECA.globalSettings.errorHandler`:
```tsx
// Set in src/main.tsx or application bootstrap
UECA.globalSettings.errorHandler = (error: Error) => {
    console.error(error.message);
    appMessageBus.unicast("App.UnhandledException", error);
};
```

**No try-catch needed** - errors in hooks, methods, events automatically handled.

**Base Component Error Methods**:
```tsx
await model.runWithErrorDisplay(async () => { /* shows dialog on error */ });
await model.runWithBusyDisplay(async () => { /* shows spinner, handles errors */ });
```

**Automatic Event Handlers**: UECA generates events for all props - no explicit declaration needed:
```tsx
// onChange<Prop> - fires AFTER property updates
events: {
    onChangeValue: (newVal, oldVal) => { 
        console.log("Value changed"); 
    }
}

// onChanging<Prop> - fires BEFORE update (can transform or block)
events: {
    onChangingValue: (newVal, oldVal) => {
        if (newVal < 0) return oldVal;  // Block invalid changes
        return newVal.toUpperCase();  // Transform before setting
    }
}

// onPropChange/onPropChanging - handle ALL property changes
events: {
    onPropChanging: (prop, newVal, oldVal) => {
        if (prop === "age" && newVal < 0) return oldVal;
        return newVal;
    },
    onPropChange: (prop, val, oldVal) => {
        console.log(`${prop} changed from ${oldVal} to ${val}`);
    }
}
```

**Event Handler Chaining**: Events passed via JSX params chain with model-defined events (model event runs first)

## MUI Component Wrapping Pattern

**Critical Convention**: 3rd party components like Material-UI are NOT used directly in application code. Only simple primitives that don't require state management can be used directly in JSX.

**All MUI components must extend `MuiBaseStruct`**:
```tsx
// Example MUI Card wrapper pattern
type CardStruct = MuiBaseStruct<{
    props: {
        title: string;
        value: string | number;
        clickable: boolean;
    };
    events: {
        onClick: () => void;
    };
}, CardProps>; // Pass MUI props type as second generic

// Use useMuiBase instead of useUIBase
const model = useMuiBase(struct, params);

// Apply MUI props via spread operator
<MUICard {...model.mui} />
```

**MUI Pattern Benefits**:
- `model.mui` provides backdoor access to all native MUI props
- Maintains UECA consistency while preserving MUI flexibility
- ReactElement props should be declared separately as `[PropertyName]View`
- Follow existing patterns in `src/components/mui/button.tsx`

**Chart Component Pattern**: Chart components follow UECA encapsulation principles with clean domain object interfaces:
```tsx
// ✅ Proper UECA chart pattern - clean encapsulation
type ChartStruct = MuiBaseStruct<{
    props: {
        chart: Chart;  // Single domain object
        width?: number;
        height?: number;
    };
}, ChartProps>;

// Component handles all internal complexity
const model = useMuiBase(struct, params);

// Usage is simple and clean
<model.pieChart.View />  // vs dozens of individual props
```

**Chart Pattern Benefits**:
- **Clean Interfaces**: Single `Chart` object instead of 15+ individual properties
- **Internal Data Transformation**: Components handle ChartDataPoint conversion internally
- **Type Safety**: Leverages existing API types instead of duplicate definitions
- **Maintainability**: Changes stay encapsulated within components
- **UECA Compliance**: Follows framework philosophy of component self-management

**Layout Components**: Always use UECA layout primitives instead of raw HTML:
```tsx
// Use Col, Row, Block for structure - never raw <div>
<Col fill spacing="large">
    <Row spacing="medium">
        <model.field1.View />
        <model.field2.View />
    </Row>
</Col>

// Use Typography for text instead of <h1>, <p>, etc.
<Typography variant="h6" component="h3" align="center">
    {model.title}
</Typography>
```

## Refactoring Best Practices

**UECA Refactoring Principles** (learned from chart system refactoring):

**1. Interface Simplification**:
- Replace multiple individual properties with cohesive domain objects
- Move from 15+ props to single domain object (e.g., `Chart`)
- Maintain backward compatibility during transitions

**2. Encapsulation Migration**:
- Move data transformation logic inside components
- Convert from external prop binding to internal data processing
- Preserve all existing functionality while simplifying interfaces

**3. Type System Cleanup**:
- Remove unused type definitions after interface changes
- Clean up export statements to include only essential types
- Maintain consistent naming patterns (`Model`, `Params`, `useHook`, `Component`)

**4. Pattern Consistency**:
- Apply same refactoring pattern across similar components
- Establish architectural standards and follow them uniformly
- Document and enforce consistent interface design principles

**Example Refactoring Process**:
```tsx
// Before: Complex interface with many props
usePieChart({
    title: "...", data: [...], innerRadius: 30, outerRadius: 80,
    showLabels: true, showLegend: true, // ...15+ more props
})

// After: Clean encapsulated interface
usePieChart({
    chart: () => model.chart  // Single domain object
})
```

When refactoring components, always prioritize clean interfaces and proper encapsulation over preserving legacy patterns.

## Integration Points

**Application Bootstrap**: `src/main.tsx` → `runApplication()` → `Application` component with hierarchical child models

**Message Bus Setup**: Define messages in `src/core/infrastructure/appMessage.ts`, handle in components via `messages` section

**Routing**: Custom typed routes in `src/core/infrastructure/appRoutes.tsx` with parameter extraction

**API Pattern**: Service clients use message bus handlers rather than direct component imports

**Layout System**: Dual layouts - `AppLayout` (sidebar/nav) and `OtherLayout` (minimal) - controlled by routing

**Validation**: Built into `EditBaseModel` - use `modelsToValidate` array and `validate()` methods

**Chart Architecture**: Complete chart visualization system with four chart types:
- **Chart Types**: `pie`, `line`, `scatter`, `bar` - each with dedicated components and configuration
- Common properties: `id`, `title`, `description`, `type`, `data`
- Type-specific configs: `pieChartConfig`, `lineChartConfig`, `scatterChartConfig`, `barChartConfig`
- Chart settings editors provide only relevant controls per chart type
- Chart components bind all configuration properties to their MUI counterparts
- **Supported Charts**:
  - PieChart: Inner/outer radius, padding angle, corner radius, label display
  - LineChart: Grid, markers, curve types (linear, monotone, step), area fill
  - ScatterChart: Axis types, margin controls, grid display
  - BarChart: Vertical/horizontal layout, axis labeling, legend positioning

**Input Type Handling**: TextField components automatically convert values based on input type:
```tsx
// Private function pattern for algorithmic logic
function _convertInputValue(inputValue: string, inputType: string): string | number {
    switch (inputType) {
        case "number": {
            const numValue = parseFloat(inputValue);
            return isNaN(numValue) ? inputValue : numValue;
        }
        default:
            return inputValue;
    }
}
```

## UECA-Specific Patterns

**Component Extension**: Use `UECA.useExtendedComponent()` for inheritance:
```tsx
const model = useEditControl(extendedStruct, params); // inherits validation
```

**Model Caching**: Components automatically cached by default (controlled by `cacheable` prop):
- **`init(model)`**: Called when model activates (creation or cache retrieval)
- **`deinit(model)`**: Called when model deactivates (loses React context)
- Use for managing subscriptions, resetting transient state
- Cache behavior: `globalSettings.modelCacheMode` ("on", "off", "auto")

**State Reactivity** (MobX-powered):
- Only **initialized properties** in `props` are reactive (MobX observable)
- Direct assignment triggers re-renders: `model.count++`
- Array items need `UECA.observe()` for reactivity:
```tsx
model.items.push(UECA.observe({id: 1, name: "Item"}));
```

**Private Members**:
- Prefix `_`: Private but reactive (if in props)
- Prefix `__`: Non-reactive private (even in props)
- Methods ending in `View`: MobX observers for reactive rendering

**JSX Structure**: Keep JSX clean and structural - move algorithmic logic to private functions:
```tsx
// Clean JSX - structural concerns only
onChange={(e) => {
    const newValue = _convertInputValue(e.target.value, model.type);
    model.value = newValue;
}}

// Private function - algorithmic concerns
function _convertInputValue(inputValue: string, inputType: string): string | number {
    // Complex logic here
}
```

**Component Interface Design** (learned from chart refactoring):
- **Prefer Domain Objects**: Pass `Chart`, `User`, `Config` objects instead of decomposed properties
- **Internal Transformation**: Components should handle data conversion internally (e.g., ChartDataPoint[] → chart-specific format)
- **Clean Exports**: Only export essential types (`Model`, `Params`, `useHook`, `Component`)
- **Remove Unused Types**: Clean up obsolete type definitions after refactoring
- **Consistent Patterns**: Establish and follow consistent interface patterns across similar components

**View Methods**: Methods ending in `View` are MobX observers for reactive rendering

When modifying this codebase, **never use standard React patterns** (useState, useEffect, Context, props drilling). Always follow UECA's structured model approach with message bus communication for component interaction.