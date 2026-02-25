# UECA Patterns In This Demo

This screen highlights common UECA patterns used to build interactive UI blocks:

## Arrow Function Bindings

Button labels and disabled states use arrow functions `() => model.property` to create reactive one-way bindings that automatically update when properties change.

## Component Children

The toolbar panel is a child model with its own buttons and state, demonstrating hierarchical component composition.

## Event Propagation

The toolbar's `onAction` event propagates button clicks to the parent screen, showing decoupled communication between components.

## Reactive State

Direct property assignment triggers automatic re-renders without explicit setState calls. Just write `model.property = value` and the UI updates.

## Encapsulated State

The toolbar manages its own state internally (locked/unlocked, pressed/unpressed) while exposing a clean interface through events.

## LogViewer Component

The screen uses a reusable LogViewer component that automatically timestamps entries and maintains a configurable history limit (default 10 items).

## Say Hello Action

The Say Hello button posts an action that the screen handles to display an alert with the action timestamp.

---

> **Try it:** Click Lock/Unlock to enable other buttons. Press the buttons and watch the action log update with timestamps. Click Explain to open this drawer.
