# UECA Binding Patterns

This demo showcases the three primary binding patterns in UECA for connecting parent and child component properties.

---

## Binding Types

### **1. Bidirectional Binding (Read-Write)**

Synchronizes property values automatically between parent and child components in both directions.

**Example:** First Name and Last Name fields

```typescript
value: UECA.bind(() => model.userName, "firstName")
```

- When the input changes, `model.userName.firstName` updates automatically
- When `model.userName.firstName` changes programmatically, the input updates
- No manual event handlers needed for synchronization

---

### **2. Custom Bidirectional Binding (Transform)**

Applies custom transformation logic when reading or writing values between parent and child.

**Example:** Full Name field

```typescript
value: UECA.bind(
    () => {
        // Getter: Combine first and last name
        let fullName = model.userName?.firstName || "";
        if (model.userName?.lastName?.trim()) {
            fullName = fullName.trim() + " " + model.userName.lastName.trim();
        }
        return fullName;
    },
    (value) => {
        // Setter: Split full name into parts
        const nameParts = (value || "").split(" ");
        model.userName.firstName = nameParts[0]?.trim() ?? "";
        model.userName.lastName = nameParts[1]?.trim() ?? "";
    }
)
```

- **Getter function**: Transforms parent data for display in child component
- **Setter function**: Transforms child input back to parent data structure
- Useful for formatting, validation, type conversion, computed values

---

### **3. Unidirectional Binding (Read-Only)**

Creates reactive, read-only connections that automatically update when dependencies change.

**Example:** Message field (arrow function syntax)

```typescript
value: () => model.firstNameInput.value
    ? `Hello ${model.fullNameInput.value.toString().toUpperCase().trim()}!`
    : ""
```

**Example:** Send button disabled state (explicit binding syntax)

```typescript
disabled: UECA.bind(() => !model.messageInput.value, undefined)
```

- Child component cannot modify parent property
- Updates automatically when reactive dependencies change
- Arrow function syntax: `() => expression`
- Explicit syntax: `UECA.bind(getter, undefined)` - setter is `undefined`

---

## When To Use Each Pattern

| Pattern | Use Case |
|---------|----------|
| **Bidirectional** | Form inputs, toggles, editable fields that directly map to data model |
| **Custom Bidirectional** | Formatted inputs (phone, currency), computed fields, data transformation |
| **Unidirectional** | Computed values, display-only fields, dependent button states |

---

## Try It

1. **Type in First Name** - watch Full Name and Message update automatically
2. **Type in Last Name** - see bidirectional sync with Full Name
3. **Edit Full Name directly** - observe custom transformation splitting name parts
4. **Watch the Send button** - it enables only when Message has content
5. **Click Send Message** - see the alert with timestamp and watch the message log update

All bindings are reactive and update automatically without manual event handlers!\
The message log uses a reusable LogViewer component that handles timestamping and history management automatically.
