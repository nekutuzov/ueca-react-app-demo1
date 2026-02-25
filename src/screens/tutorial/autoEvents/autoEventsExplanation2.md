# UECA Automatic Events System

This tutorial demonstrates UECA's complete automatic event system for reactive property changes.

---

## Four Types of Automatic Events

UECA automatically generates **four types of event handlers** for component properties. You don't declare them - UECA creates them for you!

### **1. onChange\<PropName\> (Specific, After)**

Fires **AFTER** a specific property has been updated.

```typescript
events: {
    onChangeFirstName: (newVal: string, oldVal: string) => {
        console.log(`firstName changed from "${oldVal}" to "${newVal}"`);
        // Perfect for side effects, computed properties, logging
    }
}
```

**Use cases:**
- Update computed/derived properties
- Trigger side effects
- Log property changes
- Cascade updates to related properties

---

### **2. onChanging\<PropName\> (Specific, Before)**

Fires **BEFORE** a specific property is updated. Can transform or reject the change.

```typescript
events: {
    onChangingFirstName: (newVal: unknown, oldVal: unknown) => {
        const value = String(newVal || "");
        // Transform: capitalize first letter
        if (value.length > 0) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return value;  // Accept change
        // return oldVal;  // Reject change (keep old value)
    }
}
```

**Use cases:**
- Input validation
- Value transformation
- Conditional updates
- Prevent invalid changes

---

### **3. onPropChange (Universal, After)**

Fires **AFTER** ANY property changes. Handles all properties in one place.

```typescript
events: {
    onPropChange: (propName: string, newVal: unknown, oldVal: unknown) => {
        console.log(`Property ${propName} changed: ${oldVal} → ${newVal}`);
        // Handle ANY property change generically
    }
}
```

**Use cases:**
- Generic logging
- Change tracking for undo/redo
- Universal side effects
- Debugging property changes

---

### **4. onPropChanging (Universal, Before)**

Fires **BEFORE** ANY property changes. Can transform or reject any change.

```typescript
events: {
    onPropChanging: (propName: string, newVal: unknown, oldVal: unknown) => {
        console.log(`About to change ${propName}`);
        return newVal;  // Accept or transform
    }
}
```

**Use cases:**
- Universal validation
- Cross-property validation
- Global transformation rules
- Change interception

---

## Event Execution Order

When you change a property, events fire in this sequence:

1. **onPropChanging** (universal, before)
2. **onChanging\<PropName\>** (specific, before)
3. *Property value updates*
4. **onChange\<PropName\>** (specific, after)
5. **onPropChange** (universal, after)

**Example:** When `model.firstName = "john"` with parent handler chained:

```
1. [Panel Handler] onChangingFirstName("john", "")     // Transforms to "John"
2. [Property updates to "John"]
3. [Panel Handler] onChangeFirstName("John", "")       // Updates full name
4. [Screen Handler] onChangeFirstName("John", "")      // Chained parent handler
5. [Screen Handler] onPropChange("firstName", ...)     // Universal handler
```

Note: If `onPropChanging` was defined in the panel, it would fire before step 1.

---

## Event Chaining (Critical Feature!)

UECA allows **event handlers to be defined in TWO places** simultaneously:

1. **Inside the component's struct** (model-defined handlers)
2. **Passed through hook parameters** (parent-defined handlers)

When both are present, UECA **automatically chains them** - calling both in sequence!

### **Model-Defined Handlers**

```typescript
events: {
    onChangeFirstName: (newVal, oldVal) => {
        console.log("[Panel Handler] First handler");
        model.fullName = `${model.firstName} ${model.lastName}`;
    }
}
```

### **Parent-Passed Handlers**

```typescript
autoEventsPanel: useAutoEventsPanel2({
    // This handler CHAINS with panel's handler
    onChangeFirstName: (newVal, oldVal) => {
        console.log("[Screen Handler] Second handler - called after panel handler");
    }
})
```

### **Execution Result**

```
[Panel Handler] First handler          ← Panel's handler runs first
[Screen Handler] Second handler        ← Screen's handler runs second
```

**This is incredibly powerful!** Components can have internal logic while parents can extend behavior without modifying the child.

---

## Property Binding With UECA.bind()

UECA provides the `UECA.bind()` helper for clean bidirectional property binding between parent and child components:

```typescript
children: {
    firstNameInput: useTextField({
        // UECA.bind creates bidirectional sync
        value: UECA.bind(() => model, "firstName")
    })
}
```

**How it works:**
- Parent property changes automatically flow to child
- Child changes automatically flow back to parent
- Two-way synchronization with minimal code

**Alternative approaches:**
- Arrow function + onChange handler (manual bidirectional)
- Arrow function only (unidirectional: parent → child)
- Direct value assignment (static, no reactivity)

---

## This Demo Demonstrates

### **1. Specific Property Events**

- **onChangingFirstName / onChangingLastName** - Trim whitespace and capitalize first letter (in panel)
- **onChangeFirstName / onChangeLastName** - Update computed full name (in panel)
- **onChangingEmail** - Remove spaces and invalid characters, convert to lowercase (in panel)
- **onChangeEmail** - Log email changes (in panel)
- **onChangeFullName** - Log computed full name updates (in panel)

### **2. Universal Property Events**

- **onPropChange** - Passed from screen, logs ALL property changes after they happen

Note: The panel doesn't define `onPropChanging` to keep focus on the specific events. The screen demonstrates how universal handlers can be added from parent components.

### **3. Event Chaining**

- **Panel** defines handlers in its `events` section
- **Screen** passes additional handlers through hook parameters:
  - `onChangeFirstName` - chains with panel's handler
  - `onPropChange` - adds universal logging across all properties
- Both execute in sequence: Panel handler **first**, then Screen handler

### **4. UECA.bind() for Property Binding**

- Input values bound with `UECA.bind(() => model, "firstName")`
- Creates automatic bidirectional synchronization
- Clean, concise syntax for two-way data flow

### **5. Transformation Chains**

- **First/Last Name**: Trim whitespace, then capitalize first letter
- **Email**: Remove invalid characters (only letters, numbers, @, ., -, _), then lowercase
- **Full Name**: Automatically computed from first + last name on every change
- Multiple transformations applied through onChanging events

---

## Try It!

1. **Type in First Name** - Watch trim and capitalization happen automatically
2. **Type in Last Name** - Watch trim, capitalization, and full name update automatically
3. **Type in Email with Invalid Characters** - Watch spaces and special characters automatically removed
4. **Observe the Log** - See complete event chain:
   - [Panel Handler] specific handlers (onChanging/onChange for each property)
   - [Screen Handler] chained handlers (onChangeFirstName, onPropChange)
   - Computed full name updates

Every keystroke triggers a complete event cascade, all logged in real-time!

**Try these examples:**
- Type "  john" in First Name → automatically becomes "John" (trimmed + capitalized)
- Type "test @email!.com" in Email → automatically becomes "test@email.com" (sanitized)
- Change both names → watch full name update instantly

---

## Key Takeaways

✅ **All properties get automatic events** - onChange/onChanging generated for every property

✅ **Four event types available** - specific/universal, before/after (use as needed)

✅ **Event chaining** - handlers from component AND parent both execute in sequence

✅ **Transformation pipeline** - onChanging events can validate and modify values before they're set

✅ **UECA.bind() for easy binding** - clean bidirectional sync between parent and child

✅ **Complete observability** - every property change can be tracked and logged

✅ **Computed properties** - use onChange events to update derived values automatically

This makes UECA components **highly reactive, composable, and maintainable** with minimal boilerplate!
