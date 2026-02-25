# UECA Auto Events

This demo showcases UECA's automatic event system for reactive property changes.

---

## What are Auto Events?

Auto events are **automatically generated event handlers** for every property in a UECA component. You don't need to explicitly declare them - UECA creates them for you!

For every property `propName`, UECA automatically provides:

- **`onChange<PropName>`** - Fires AFTER the property value changes
- **`onChanging<PropName>`** - Fires BEFORE the property changes (can transform or block)

---

## Event Types

### **1. onChange (After Change)**

Fires after a property has been updated. Perfect for side effects and cascading updates.

```typescript
events: {
    onChangeZipCode: (newValue: string, oldValue: string) => {
        console.log(`zipCode changed from ${oldValue} to ${newValue}`);
        // Trigger API calls, update other components, log changes
    }
}
```

**Use cases:**
- Logging property changes
- Triggering API calls
- Updating dependent properties
- Broadcasting notifications

---

### **2. onChanging (Before Change)**

Fires before a property value is updated. Can transform the value or block the change.

```typescript
events: {
    onChangingValue: (newVal: string, oldVal: string) => {
        // Allow only numbers
        if (newVal === "" || /^\d+$/.test(newVal)) {
            return newVal;  // Accept the change
        }
        return oldVal;  // Reject the change
    }
}
```

**Use cases:**
- Input validation
- Value transformation
- Conditional updates
- Change prevention

---

### **3. onPropChange / onPropChanging (Universal)**

Handle ALL property changes in a single event handler.

```typescript
events: {
    onPropChange: (propName: string, newVal: any, oldVal: any) => {
        console.log(`Property ${propName} changed`);
    },
    
    onPropChanging: (propName: string, newVal: any, oldVal: any) => {
        // Transform or block any property change
        return newVal;
    }
}
```

**Use cases:**
- Generic logging
- Cross-property validation
- Change tracking for undo/redo

---

## How This Demo Works

### **Step 1: User Action**
User enters a zip code in the input field and clicks "Apply".

### **Step 2: Property Assignment**
The button's `onClick` handler sets `model.zipCode = model.zipCodeInput.value`.

### **Step 3: Auto Event Fires**
UECA automatically calls `onChangeZipCode` event handler in the parent component.

```typescript
events: {
    onChangeZipCode: (newZipCode: string, oldZipCode: string) => {
        model.onActivityLog?.(`Property changed from '${oldZipCode}' to '${newZipCode}'`);
    }
}
```

### **Step 4: Property Binding Propagates**
The `zipCodeDetails` component has `zipCode: () => model.zipCode` binding, so it automatically receives the new value.

### **Step 5: Child Auto Event Fires**
The `zipCodeDetails` component's `onChangeZipCode` event fires automatically.

```typescript
events: {
    onChangeZipCode: async (newZipCode: string) => {
        if (newZipCode && newZipCode.length >= 5) {
            model.details = await model.bus.unicast("Tutorial.GetZipCodeDetails", { zipCode: newZipCode });
        }
    }
}
```

### **Step 6: Data Fetched**
The event handler fetches zip code details via message bus and updates the `details` property.

### **Step 7: UI Updates**
Property changes trigger reactive re-renders, updating the UI automatically.

---

## Benefits of Auto Events

### **Zero Boilerplate**
No need to declare events for properties - they're automatically available!

### **Reactive Programming**
Properties become reactive streams that can trigger side effects automatically.

### **Cascading Updates**
Property changes can trigger other property changes in a controlled, observable way.

### **Type Safety**
Auto events are fully typed based on the property types they handle.

### **Debugging**
Easy to trace property changes throughout the component hierarchy.

---

## Common Patterns

### **Input Validation**

```typescript
zipCodeInput: useTextField({
    onChangingValue: (newVal: string, oldVal: string) => {
        // Only allow digits
        if (newVal === "" || /^\d+$/.test(newVal)) {
            return newVal;
        }
        return oldVal;
    }
})
```

### **API Calls on Change**

```typescript
events: {
    onChangeZipCode: async (zipCode: string) => {
        if (zipCode.length >= 5) {
            model.details = await model.bus.unicast("Tutorial.GetZipCodeDetails", { zipCode });
        }
    }
}
```

### **Dependent Properties**

```typescript
events: {
    onChangeFirstName: () => {
        model.fullName = `${model.firstName} ${model.lastName}`;
    },
    onChangeLastName: () => {
        model.fullName = `${model.firstName} ${model.lastName}`;
    }
}
```

### **Change Logging**

```typescript
events: {
    onPropChange: (prop: string, newVal: any, oldVal: any) => {
        console.log(`${prop}: ${oldVal} → ${newVal}`);
    }
}
```

---

## Watch the Activity Log

The log below shows the event cascade in real-time:

1. **Property Change** - When you click Apply, `zipCode` property changes
2. **Parent Event** - Parent's `onChangeZipCode` logs the change
3. **Child Update** - Property binding propagates to child component
4. **Child Event** - Child's `onChangeZipCode` fires and fetches data
5. **Data Received** - API response updates the UI

All of this happens automatically without explicit event wiring!

---

## Real-World Usage

Auto events are perfect for:

- **Form validation** - Validate inputs as they change
- **Computed properties** - Update derived values automatically
- **API integration** - Fetch data when dependencies change
- **State synchronization** - Keep related properties in sync
- **Change tracking** - Log or undo property modifications
- **Cascading updates** - Trigger multi-step update flows

Try entering different zip codes like **10001** (New York), **90210** (Beverly Hills), or **60601** (Chicago) to see the automatic event system in action!
