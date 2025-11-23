# Dark Mode Implementation

This document describes the dark mode implementation in the QR Generator application.

## Features

- **Automatic System Preference Detection**: The app automatically detects and applies the user's system dark mode preference
- **Manual Toggle**: Users can manually toggle between light and dark modes
- **Persistent Storage**: User's preference is saved in localStorage and persists across sessions
- **Smooth Transitions**: All color changes include smooth transitions for better UX
- **Comprehensive Coverage**: Dark mode is implemented across all major components

## Implementation Details

### 1. Dark Mode Context (`src/context/DarkModeContext.jsx`)

The dark mode state is managed through a React context that provides:
- `isDarkMode`: Boolean indicating current dark mode state
- `toggleDarkMode()`: Function to toggle between light and dark modes
- `setDarkMode(value)`: Function to set dark mode to a specific value

### 2. Tailwind Configuration (`tailwind.config.js`)

Dark mode is enabled using Tailwind's class strategy:
```javascript
darkMode: 'class'
```

This allows us to control dark mode by adding/removing the `dark` class on the `html` element.

### 3. Usage

#### In Components

```jsx
import { useDarkMode } from '../context/DarkModeContext';

const MyComponent = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      <button onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>
    </div>
  );
};
```

#### Using the DarkModeToggle Component

```jsx
import DarkModeToggle from '../components/common/DarkModeToggle';

const MyComponent = () => {
  return (
    <div>
      <DarkModeToggle size="md" />
    </div>
  );
};
```

### 4. Dark Mode Classes

The application uses consistent dark mode classes:

#### Background Colors
- `bg-white dark:bg-gray-800` - Main content areas
- `bg-gray-50 dark:bg-gray-900` - Page backgrounds
- `bg-gray-100 dark:bg-gray-700` - Hover states

#### Text Colors
- `text-gray-900 dark:text-white` - Primary text
- `text-gray-600 dark:text-gray-400` - Secondary text
- `text-gray-500 dark:text-gray-500` - Muted text

#### Border Colors
- `border-gray-200 dark:border-gray-700` - Standard borders
- `border-gray-300 dark:border-gray-600` - Input borders

#### Interactive Elements
- `hover:bg-gray-100 dark:hover:bg-gray-700` - Hover states
- `focus:ring-blue-500 dark:focus:ring-blue-400` - Focus states

### 5. Components with Dark Mode Support

- ✅ Header (with dark mode toggle)
- ✅ Footer
- ✅ Profile page
- ✅ Navigation menus
- ✅ Forms and inputs
- ✅ Buttons and interactive elements
- ✅ Modals and overlays

### 6. Browser Support

The dark mode implementation works in all modern browsers that support:
- CSS custom properties
- `localStorage`
- `matchMedia` API
- CSS `prefers-color-scheme` media query

### 7. Testing

To test dark mode:
1. Use the toggle button in the header
2. Check that the preference persists after page refresh
3. Test with system dark mode preference changes
4. Verify all components render correctly in both modes

### 8. Future Enhancements

Potential improvements:
- Add more color themes beyond just light/dark
- Implement automatic switching based on time of day
- Add animation preferences for users with motion sensitivity
- Create theme-specific QR code styling options
