# UECA Message Bus

This demo showcases UECA's message bus pattern for decoupled component communication.

---

## What is the Message Bus?

The message bus is a centralized communication channel that allows components to send and receive typed messages without direct dependencies. Components can:

- **Post messages** to trigger actions anywhere in the application
- **Subscribe to messages** to respond to events from any component
- **Request/response patterns** for data retrieval and state queries
- **Broadcast notifications** for multi-component coordination

---

## Demonstrated Patterns

This screen demonstrates three core message bus patterns:

### **1. Unicast (Request/Response)**

Send a message to the first (the only) subscriber and wait for a response. Perfect for queries and commands.

```typescript
// Get current state
const state = await model.bus.unicast("App.GetSideBarState", undefined);

// Set new state
await model.bus.unicast("App.SetSideBarState", { collapsed: true });

// Request data from API
const joke = await model.bus.unicast("Tutorial.MakeJoke", undefined);
```

**Use cases:**
- State queries and commands
- API calls
- Single-handler operations

---

### **2. Broadcast (Notification)**

Notify all subscribers about an event. No responses are collected.

```typescript
// Notify all listeners of state change
await model.bus.broadcast("", "App.SideBarStateChanged", { collapsed: true });
```

**Use cases:**
- State change notifications
- Event propagation to multiple components
- Pub/sub patterns

---

### **3. Message Subscription**

Components declare message handlers to respond to broadcasts and unicasts.

```typescript
messages: {
    "App.SideBarStateChanged": async ({ collapsed }) => {
        model._appSideBarCollapsed = collapsed;
        model.onMessageBusInteraction?.("Received state change");
    }
}
```

**Use cases:**
- Reacting to state changes
- Handling commands
- Providing services to other components

---

## Examples in This Demo

### **Side Bar Control**

**Pattern**: Unicast command + Broadcast notification + Message subscription

1. **Toggle Button** sends `App.SetSideBarState` (unicast) to appSideBar
2. **AppSideBar** updates its `collapsed` property
3. **onChange event** automatically broadcasts `App.SideBarStateChanged`
4. **MessageBusPanel** subscribes to `App.SideBarStateChanged` to update its button text

This demonstrates bidirectional synchronization without direct component coupling!

### **State Initialization**

**Pattern**: Unicast query in `init` hook

```typescript
init: async () => {
    const state = await model.bus.unicast("App.GetSideBarState", undefined);
    model._appSideBarCollapsed = state.collapsed;
}
```

Components can query current state from anywhere during initialization.

### **API Call via Message Bus**

**Pattern**: Unicast request/response for external data

The Joker component fetches jokes using `Tutorial.MakeJoke` message. The service handler (in `demoServiceApiClient.tsx`) makes the actual API call and returns the result.

---

## Benefits of Message Bus

### **Decoupling**
Components don't need direct references. Services can be anywhere in the component tree.

### **Type Safety**
All messages are strongly typed with input/output parameters defined in `AppMessage`.

### **Bidirectional Sync**
Broadcast notifications enable multiple components to stay synchronized with shared state.

### **Testing**
Easy to mock message handlers for unit testing without changing component code.

---

## Message Declaration

Messages are declared in `appMessage.ts`:

```typescript
type MiscMessages = {
    "App.GetSideBarState": { out: { collapsed: boolean } };
    "App.SetSideBarState": { in: { collapsed: boolean } };
    "App.SideBarStateChanged": { in: { collapsed: boolean } };
}

type TutorialDataServiceMessage = {
    "Tutorial.MakeJoke": { out: string };
}
```

---

## Watch the Activity Log

The log below shows all message bus interactions in real-time:

1. **Initialization** - Component queries initial side bar state
2. **User Actions** - Button clicks trigger unicast commands
3. **State Changes** - Broadcast notifications received by subscribers
4. **API Calls** - External data requests via message bus

All communication happens through the typed message bus without direct component coupling!

---

## Real-World Usage

In this app, the message bus is used for:

- **State Management** - Components query and update shared state
- **API Calls** - Services listen for API messages and handle requests
- **Dialogs** - Any component can show dialogs via message bus
- **Navigation** - Route changes triggered via messages
- **Notifications** - Toast alerts from anywhere in the app
