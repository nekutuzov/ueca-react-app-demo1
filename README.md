# UECA React App

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![UECA-React](https://img.shields.io/badge/UECA--React-2.0-FF6B35)](https://www.npmjs.com/package/ueca-react)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite)](https://vitejs.dev/)
[![MUI](https://img.shields.io/badge/MUI-7.3-007FFF?logo=mui)](https://mui.com/)

A comprehensive demonstration application showcasing **UECA-React** (Unified Encapsulated Component Architecture) - an innovative framework that abstracts React patterns into a structured component model with props, children, methods, events, and message bus communication.

## What is UECA-React?

UECA-React replaces standard React patterns (useState, useEffect, Context) with a unified component architecture that emphasizes:
- **Black Box Components** - Self-contained units with encapsulated state
- **Message Bus Communication** - Decoupled inter-component messaging instead of prop drilling
- **Reactive State Management** - MobX-powered automatic re-rendering
- **Structured Lifecycle Hooks** - Clear initialization, mounting, and cleanup phases
- **Property Bindings** - Unidirectional, bidirectional, and custom binding patterns
- **Automatic Events** - Every property generates onChange events automatically

## 🚀 [Live Demo](https://nekutuzov.github.io/ueca-react-app/)

Explore the live application to see all features in action!

## ✨ Features

### UECA-React Core Features
- 🏗️ **Component Architecture** - Black box components with structured props, methods, events, and children
- 📡 **Message Bus** - Typed message bus for decoupled component communication (unicast, broadcast, castTo)
- 🔗 **Property Bindings** - Unidirectional, bidirectional, and custom binding patterns
- ⚡ **Automatic Events** - Auto-generated onChange/onChanging events for all properties
- 🔄 **Lifecycle Hooks** - Structured component lifecycle (constr, init, mount, draw, erase, unmount, deinit)
- 📚 **Interactive Tutorials** - Built-in tutorials demonstrating bindings, events, message bus, and toolbar patterns

### Application Features
- 🎨 **Modern UI Components** - Material-UI v7 components wrapped in UECA architecture
- 📊 **Rich Data Visualization** - Interactive charts (Bar, Line, Pie, Scatter) with dynamic configuration
- 🧭 **Advanced Routing** - UECA's built-in router with breadcrumb navigation and browsing history
- 📱 **Responsive Layout** - Adaptive sidebar, top bar, and mobile-friendly design
- 🌓 **Theme Management** - Light/dark mode support with customizable themes
- 💬 **Alert System** - Toast notifications, dialogs, and drawers via message bus
- 📋 **CRUD Operations** - Complete examples for Create, Read, Update, Delete with validation
- 🎭 **API Mocking** - Mock Service Worker (MSW) for development without backend
- 📝 **Markdown Support** - Integrated markdown preview for documentation
- 📊 **Data Tables** - Virtualized tables with sorting and filtering
- 🔐 **Authentication & Security** - Built-in login form and security infrastructure

## 🛠️ Tech Stack

- **Core Framework:** [UECA-React](https://www.npmjs.com/package/ueca-react) 2.0 - Unified component architecture with message bus
- **UI Framework:** React 19 (minimal usage - only for model instantiation)
- **Build Tool:** Vite 7
- **Language:** TypeScript 5.8
- **UI Library:** Material-UI (MUI) 7.3
- **State Management:** MobX 6.13 (abstracted by UECA)
- **Routing:** UECA's built-in router with typed routes
- **Charts:** MUI X-Charts 8.17
- **Styling:** Emotion & Styled Components
- **Development:** ESLint, Mock Service Worker (MSW)

> **Note:** UECA-React replaces standard React hooks (useState, useEffect, useContext) with its own component model and lifecycle system.

## 📦 Getting Started

### Prerequisites

- Node.js (v22 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nekutuzov/ueca-react-app.git
   cd ueca-react-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5001/myapp`

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 📁 Project Structure

```
ueca-react-app/
├── public/              # Static assets
├── src/
│   ├── api/            # API clients and mock handlers
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable UI components
│   │   ├── base/       # Base component classes
│   │   ├── chart/      # Chart configuration components
│   │   ├── dialog/     # Alert dialogs, drawers, toasts
│   │   ├── layout/     # Layout components
│   │   ├── mui/        # MUI wrapper components
│   │   ├── navigation/ # Navigation components
│   │   ├── table/      # Data table components
│   │   └── tabs/       # Tab container components
│   ├── core/           # Core application infrastructure
│   │   ├── infrastructure/ # App setup, routing, theme, security
│   │   └── layout/     # Main app layout components
│   ├── screens/        # Application screens/pages
│   │   ├── demo/       # Demo screens (charts, dashboard, users)
│   │   ├── home/       # Home screen
│   │   ├── layout/     # Screen layout utilities
│   │   └── tutorial/   # Tutorial screens
│   └── main.tsx        # Application entry point
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration
```

## 🎓 Learning UECA-React

### Interactive Tutorials

The application includes comprehensive tutorials demonstrating UECA-React patterns:

- **Property Bindings** (`/tutorial/bindings`) - Unidirectional, bidirectional, and custom binding patterns with live examples
- **Auto Events** (`/tutorial/autoEvents`) - Automatic onChange and onChanging event generation and validation
- **Message Bus** (`/tutorial/messageBus`) - Decoupled component communication with unicast, broadcast, and castTo patterns
- **Toolbar Actions** (`/tutorial/toolbar`) - Component interaction, event propagation, and state management

### Demo Applications

- **Dashboard** (`/demo/dashboard`) - Cards, charts, and data visualization
- **User Management** (`/demo/users`) - Full CRUD operations with validation
- **Chart Management** (`/demo/charts`) - Dynamic chart configuration with type-specific settings

### Documentation

UECA-React documentation is available in `node_modules/ueca-react/docs/` after installation:
- Component Mental Model
- Lifecycle Hooks
- Message Bus Communication
- Property Bindings
- State Management
- Automatic Events

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Aleksey Suvorov**
- Email: cranesoft@protonmail.com

## 🙏 Acknowledgments

- Built with [UECA-React](https://www.npmjs.com/package/ueca-react) framework
- UI components from [Material-UI](https://mui.com/)
- Powered by [Vite](https://vitejs.dev/) for blazing-fast development

---

⭐ If you find this project useful, please consider giving it a star!
