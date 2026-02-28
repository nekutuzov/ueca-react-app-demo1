# UECA Patterns In This Demo

This user editor screen demonstrates comprehensive UECA patterns for building full-featured CRUD forms:

## Nested Bidirectional Bindings

Form fields bind to properties of nested objects using `UECA.bind(() => model.user?.address, "street")`. UECA handles undefined parent objects gracefully, making optional nested data easy to manage.

## CRUD Screen Pattern

The screen uses `CRUDScreenModel` with full create/read/update/delete workflow:
- **Create**: New user with ID "0"
- **Read**: Fetch existing user data
- **Update**: Save modifications
- **Delete**: Remove user record
- Built-in save/cancel/delete/refresh buttons with proper state management

## Form Validation

The `modelsToValidate` array specifies required fields (name, email, country). The CRUD screen automatically validates before allowing save operations, showing inline error messages for invalid fields.

## Route Integration

The screen reads user ID from route parameters (`/users/:id`) and automatically updates the route after creating a new user, seamlessly transitioning from "new user" to "edit user" mode.

## Conditional Data Initialization

The `doOnRefresh` method handles two scenarios:
- **New User (ID "0")**: Creates empty user object with default values
- **Existing User**: Fetches data via message bus and handles not-found cases

## Structured Form Layout

The content uses UECA layout primitives to create organized sections:
- User Information section with name, email, avatar URL, and active status
- Address Information section with street, city, state, ZIP, and country
- Responsive column layout with proper spacing

## Avatar Preview

The form includes real-time avatar preview using the provided URL, demonstrating how UECA components can mix data entry with visual feedback.

## State Management

All form fields use bidirectional bindings that automatically trigger the "modified" state when changed, enabling/disabling save and cancel buttons appropriately.

## Message Bus API Integration

CRUD operations use the message bus pattern:
- `Api.GetUser` - Fetch user data
- `Api.CreateUser` - Create new user
- `Api.UpdateUser` - Update existing user
- `Api.DeleteUser` - Delete user

## Parent Screen Navigation

After deletion, the screen automatically navigates back to the user list using `goToParentScreen()`, maintaining proper navigation flow.

---

> **Try it:** Create a new user by clicking "Add New" from the user list. Edit fields and see the Save button enable. Add an avatar URL and watch the preview update. Use Save/Cancel/Delete buttons to test the full CRUD workflow.
