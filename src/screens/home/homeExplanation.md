# UECA React Application Architecture

This document provides a high-level overview of the application's architectural structure, component organization, and communication patterns.

## Application Structure Overview

The application follows a hierarchical component architecture with clear separation of concerns and message-based communication between components.

### Top-Level Organization

```
Application
├── Infrastructure Components
│   ├── App Context (routing, configuration)
│   ├── User Context (authentication, user data)
│   ├── App Security (authorization, permissions)
│   └── App Local Storage (persistent state)
├── App UI
│   ├── App Layout (main application interface)
│   ├── Other Layout (alternative layouts)
│   └── Support Components (dialogs, toasts, busy indicators)
```

## Core Infrastructure Components

### Application Layer

The **Application** component serves as the root container, bootstrapping the entire application and managing:
- **App Context**: Global application state, routing configuration, and shared services
- **User Context**: User authentication status, profile data, and session management
- **App Security**: Permission checks, role-based access control, and authorization logic
- **App Local Storage**: Persistent data storage using browser localStorage
- **App Browsing History**: Navigation history tracking for back/forward functionality
- **App API Client**: Centralized HTTP client for all backend communication

All infrastructure components are connected via the **Message Bus**, enabling decoupled communication throughout the application.

## Application UI Architecture

### App Layout Structure

The main application interface uses the **App Layout** pattern, which provides:

**Top Bar Components**:
- **Search Bar**: Global search functionality
- **User Menu**: User profile, settings, and logout options
- **Help Menu**: Documentation, support, and about information

**Side Navigation**:
- **Main Menu**: Hierarchical navigation with menu items for all application screens
- Collapsible/expandable sidebar for space optimization

**Content Area**:
- **Screen Router**: Routes requests to appropriate screens based on URL
- **Active Screen**: Currently displayed screen content

### Screen Structure

Each screen follows a consistent three-layer structure:

**1. Screen Container**:
- Manages screen-level state and lifecycle
- Handles routing parameters and navigation
- Coordinates child components via message bus

**2. Screen Layout**:
- **Header Section**: Contains breadcrumbs and screen-specific operations
  - **Bread Crumbs**: Navigation path from home to current location
  - **Screen Operations**: Action buttons (save, cancel, delete, etc.)
- **Content Section**: The main working area of the screen

**3. Screen Content**:
- **Visual Components**: UI elements (forms, tables, charts, cards)
- **Non-visual Components**: Business logic, data management, validation
- **Data Components**: API integration, caching, state management

## Layout Variants

### App Layout (Authorized Users)

Used for authenticated users with full application access:
- Complete navigation menu with all authorized screens
- Top bar with user profile and settings
- Full header with breadcrumbs and operations
- Screen router managing main application screens

### Other Layout (Public/Minimal Access)

Used for public pages or minimal interfaces:
- **Other Router**: Simplified routing for non-authenticated pages
- **Document Viewer**: Documentation and help content display
- **Custom Pages**: Landing pages, about pages, public forms
- Minimal or no navigation menu
- Simplified or absent top bar

Determined by route configuration and authentication state.

## Communication Architecture

### Message Bus Pattern

The application uses a **typed message bus** for all inter-component communication, providing:

**Advantages**:
- Decoupled components (no direct dependencies)
- Type-safe message contracts
- Easy to add new message handlers
- Testable in isolation

**Message Types**:
- **Commands**: Trigger actions (e.g., "Save.User", "Delete.Record")
- **Queries**: Request data (e.g., "Get.Users", "Fetch.ChartData")
- **Events**: Notify of state changes (e.g., "User.LoggedIn", "Data.Updated")

**Communication Modes**:
- **Unicast**: First matching subscriber handles the message
- **Broadcast**: All matching subscribers receive the message
- **CastTo**: Direct message to specific component by ID

### Component Communication Patterns

Components communicate through three primary mechanisms:

**1. Direct Model Access** (Parent → Child):
- Parent components call child methods directly
- Used for building composite components
- Unidirectional flow (inward only)

**2. Event Propagation** (Child → Parent):
- Children emit events that parents handle
- Automatic events for all property changes
- Custom events for domain-specific actions

**3. Message Bus** (Any → Any):
- Decoupled communication across component hierarchy
- API calls, dialogs, and cross-screen coordination
- Global state changes and notifications

## Authorization and Security

### View-Based Authorization

The application renders different content based on user authorization:

**Authorized View**:
- Full **App Layout** with complete navigation
- Access to all permitted screens and operations
- User-specific data and personalization

**Unauthorized View**:
- **Login Page** for authentication
- Minimal interface without navigation
- Public-only content and operations

Authorization decisions are made by **App Security** component using:
- User roles and permissions
- Route-level access rules
- Component-level visibility controls

## Support Components

### Dialog System

Three types of dialogs for user notifications:

**Message Dialog**:
- Modal dialogs for important messages
- Requires user acknowledgment
- Blocks interaction until dismissed

**Toast Dialog**:
- Non-intrusive notifications
- Auto-dismiss after timeout
- Stacks multiple messages

**Alert Drawer**:
- Side panel for detailed information
- Allows interaction while open
- Used for help, explanations, and forms

### Busy Display

Global loading indicator for:
- API calls in progress
- Long-running operations
- Screen transitions
- Data processing

Prevents multiple simultaneous operations and provides user feedback.

## Screen Development Patterns

### CRUD Screen Pattern

Most data management screens follow the CRUD pattern:

**Screen Components**:
- **Data Table/List**: Display records with sorting, filtering, paging
- **Detail Form/Panel**: Edit individual records with validation
- **Operations Bar**: Create, save, cancel, delete buttons
- **Search/Filter**: Query and filter data

**Workflow**:
1. Screen loads and fetches data via message bus
2. User interacts with table/form components
3. Changes are validated locally
4. Save/delete operations send messages to API handler
5. Screen updates based on API response

### Tutorial Screen Pattern

Tutorial screens demonstrate specific UECA features:

**Screen Structure**:
- **Demo Panel**: Interactive component showing the feature
- **Log Viewer**: Activity log showing events and state changes
- **Explanation Drawer**: Markdown documentation with Try It sections
- Focus on learning one concept at a time

## API Integration

### Centralized API Client

**App API Client** handles all backend communication:
- Base URL configuration
- Authentication token injection
- Request/response interceptors
- Error handling and retry logic
- Mock service worker for development

**Message-Based API**:
- Screens send API messages (e.g., "Api.GetUsers")
- API client handles messages and returns results
- Automatic error handling via global error handler
- Busy indicator integration

## Routing and Navigation

### App Router

**App Router** manages navigation and URL synchronization:
- Route definitions with parameters
- URL generation from route objects
- Browser history integration
- Route guards for authorization

**Navigation Methods**:
- **Menu Items**: Click navigation menu entries
- **Bread Crumbs**: Navigate up the hierarchy
- **Direct Navigation**: Message bus "Navigate.To" messages
- **Browsing History**: Browser back/forward buttons

### Screen Router

**Screen Router** (within App Layout) determines which screen to display:
- Matches current URL to screen components
- Passes route parameters to screens
- Handles screen transitions and cleanup
- Manages screen lifecycle hooks

## Component Organization

### File Structure

```
src/
├── core/
│   ├── infrastructure/    # Bootstrap, contexts, message bus
│   └── layout/           # App Layout, Other Layout, top bar, sidebar
├── screens/
│   ├── dashboard/        # Dashboard screen
│   ├── user/            # User management screens
│   ├── chart/           # Chart management screens
│   └── tutorial/        # Tutorial screens
├── components/
│   ├── base/            # Base component classes
│   ├── mui/             # Material-UI wrappers
│   ├── layout/          # Layout primitives (Row, Col, Block)
│   ├── dialog/          # Dialog components
│   ├── navigation/      # Router, nav links
│   └── table/           # Data table component
└── api/
    ├── demoServiceApiClient.tsx  # API client implementation
    ├── demoServiceApiTypes.ts    # API data types
    └── mocks/                     # MSW mock handlers
```

### Component Categories

**Visual Components** (Blue in diagram):
- User interface elements
- Render JSX views
- Handle user interactions
- Connected to message bus

**Non-visual Components** (Green in diagram):
- Business logic and services
- No UI rendering
- Pure data processing
- Message bus handlers

**Data Components** (Gray in diagram):
- API data types
- Domain models
- Configuration objects
- No behavior, only structure

## Key Architectural Principles

1. **Component Encapsulation**: Components manage their own state and expose minimal interfaces

2. **Decoupled Communication**: Message bus eliminates direct dependencies between distant components

3. **Hierarchical Structure**: Clear parent-child relationships with unidirectional data flow

4. **Separation of Concerns**: Visual, business logic, and data layers are distinct

5. **Type Safety**: TypeScript ensures compile-time correctness across all boundaries

6. **Reusability**: Base components provide common functionality for all screens

7. **Testability**: Message-based architecture enables isolated component testing

8. **Flexibility**: Multiple layouts support different user experiences (authenticated vs. public)

This architecture provides a scalable, maintainable foundation for enterprise-level React applications while leveraging the UECA framework's component model and reactive patterns.
