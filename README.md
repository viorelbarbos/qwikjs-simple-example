# Qwik.js Best Practices Guide

This README outlines the best practices for developing Qwik.js applications, covering code organization, component structure, CSS conventions, and development workflows.

## 📁 Project Structure

### Component Organization
Components should be organized in a hierarchical structure where each component has its own folder containing related files:

```
src/
  components/
    developers/
      developers.tsx              # Main component
      developers.module.css       # Component styles
      developer/                  # Sub-component
        developer.tsx
        developer.module.css
    add-or-edit-developer/
      add-or-edit-developer.tsx
      add-or-edit-developer.module.css
    form/
      input.tsx
      input.module.css
```

## 📦 Import Order Convention

Organize imports in components following this specific order:

```tsx
// 1. General imports (React-like, utilities, libraries)
import { component$, useSignal, useComputed$, useTask$ } from '@builder.io/qwik';
import { $, QRL } from '@builder.io/qwik';

// 2. Context imports
import { useDeveloper } from '~/contexts/use-developer';

// 3. Hooks (custom hooks)
import { useCustomHook } from '~/hooks/use-custom-hook';

// 4. Helpers and utilities
import { formatDate, validateEmail } from '~/utils/helpers';

// 5. Constants
import { API_ENDPOINTS, DEFAULT_VALUES } from '~/constants/app-constants';

// 6. CSS imports
import styles from './component.module.css';

// 7. External package components (libraries)
import { Modal } from '@qwik-ui/headless';
import { Button } from '@some-ui-library';

import Header from '~/components/header/header';
import Sidebar from '~/components/sidebar/sidebar';
import Footer from '~/components/footer/footer';
```

## 🏗️ Component Structure

Follow this order when structuring component logic:

```tsx
export default component$(() => {
  // 1. Get data from contexts
  const { devStore, editDeveloper, removeDeveloper } = useDeveloper();
  const { user, isAuthenticated } = useAuth();

  // 2. useSignal for reactive primitives
  const isLoading = useSignal(false);
  const searchQuery = useSignal('');
  const selectedItems = useSignal<string[]>([]);

  // 3. useComputed for derived state
  const filteredDevelopers = useComputed$(() => {
    return devStore.developers.filter(dev => 
      dev.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  const selectedCount = useComputed$(() => selectedItems.value.length);

  // 4. Functions and event handlers
  const handleSearch = $((query: string) => {
    searchQuery.value = query;
  });

  const handleSelection = $((id: string) => {
    const current = selectedItems.value;
    if (current.includes(id)) {
      selectedItems.value = current.filter(item => item !== id);
    } else {
      selectedItems.value = [...current, id];
    }
  });

  // 5. useTask$ and useVisibleTask$ at the end
  useTask$(({ track }) => {
    track(() => searchQuery.value);
    // Perform side effects when search query changes
  });

  useVisibleTask$(() => {
    // DOM-related side effects
  });

  return (
    // Template
  );
});
```

## 🎨 CSS Best Practices

### BEM (Block Element Modifier) Structure

Use BEM methodology for CSS class naming:

```css
/* Block */
.developer {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: 24px;
}

/* Element */
.developer__name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-800);
}

.developer__badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: var(--border-radius-xl);
}

.developer__actions {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
}

/* Modifier */
.developer__badge--junior {
  background: var(--color-badge-junior-bg);
  color: var(--color-badge-junior-text);
}

.developer__badge--senior {
  background: var(--color-badge-senior-bg);
  color: var(--color-badge-senior-text);
}

.developer__actions-edit {
  color: var(--color-info);
  border-color: var(--color-badge-junior-border);
}

.developer__actions-delete {
  color: var(--color-error);
  border-color: var(--color-error-border);
}
```

### CSS Class Order in Template

Structure CSS classes in the same order they appear in the template:

```tsx
return (
  <div class={styles.developer}>
    <h3 class={styles.developer__name}>{developer.name}</h3>
    
    <span 
      class={[
        styles.developer__badge,
        developer.isJunior 
          ? styles['developer__badge--junior']
          : styles['developer__badge--senior']
      ]}
    >
      {status}
    </span>
    
    <div class={styles.developer__frameworks}>
      <span class={styles.developer__frameworks-title}>Frameworks:</span>
      <div class={styles.developer__framework-list}>
        {/* Framework items */}
      </div>
    </div>

    <div class={styles.developer__actions}>
      <button class={styles['developer__actions-edit']}>Edit</button>
      <button class={styles['developer__actions-delete']}>Delete</button>
    </div>
  </div>
);
```

## 🔑 Unique Identifiers for Keys

Always use unique, stable identifiers when mapping over arrays:

```tsx
// ✅ GOOD: Use unique, stable IDs
{developers.map((developer) => (
  <DeveloperCard 
    key={developer.id}  // Unique ID from database
    developer={developer}
  />
))}

// ✅ GOOD: Composite keys when needed
{developer.frameworks.map((framework, index) => (
  <span 
    key={`${developer.id}-${framework.name}`}
    class={styles.framework}
  >
    {framework.name}
  </span>
))}

// ❌ BAD: Using array index as key
{developers.map((developer, index) => (
  <DeveloperCard 
    key={index}  // Don't use index!
    developer={developer}
  />
))}

// ❌ BAD: Using non-unique values
{frameworks.map((framework) => (
  <span 
    key={framework.name}  // Names might not be unique!
    class={styles.framework}
  >
    {framework.name}
  </span>
))}
```

### Why Using Array Index as Key is Bad

Using array index as a key causes several critical issues:

#### **1. Breaks Component Identity**
When the array order changes, components get confused about which is which:

```tsx
// Initial render: [Alice(0), Bob(1), Charlie(2)]
// After removing Alice: [Bob(0), Charlie(1)]
// Qwik thinks Bob changed from Alice and Charlie changed from Bob!
```

#### **2. State Confusion**
Components maintain internal state incorrectly:

```tsx
const DeveloperCard = component$(() => {
  const isExpanded = useSignal(false); // Internal state
  
  // User expands Bob's card (index 1)
  // Alice gets deleted
  // Bob moves to index 0, but his expansion state 
  // stays with component at index 1 (Charlie)!
  // Result: Charlie appears expanded instead of Bob
});
```

#### **3. Performance Issues**
- Qwik can't optimize properly
- Recreates DOM unnecessarily
- Loses rendering optimizations

#### **4. Input Field State Loss**
Form inputs lose their values when array order changes because the input state belonged to the index position, not the actual item.

#### **5. Animation Problems**
CSS animations and transitions break because they apply to wrong components after re-ordering.

**The Solution:** Always use stable, unique identifiers like `developer.id` that don't change based on array position! 🎯

## 🧹 Code Quality Standards

### Remove Unused Imports and Comments

```tsx
// ❌ BAD: Unused imports and unnecessary comments
import { component$, useSignal, useStore } from '@builder.io/qwik'; // useStore not used
import { SomeUnusedComponent } from './unused'; // Not used in component

export default component$(() => {
  // This is a developer component that shows developer info
  const name = useSignal(''); // TODO: implement this later
  
  /* 
   * Multi-line comment explaining obvious code
   */
  return (
    <div>
      {/* Another obvious comment */}
      <h1>Developer</h1>
    </div>
  );
});

// ✅ GOOD: Clean, minimal code without comments
import { component$, useSignal } from '@builder.io/qwik';

export default component$(() => {
  const name = useSignal('');
  
  return (
    <div>
      <h1>Developer</h1>
    </div>
  );
});
```

### Comments Policy

**Code should NOT have comments** unless absolutely necessary:

```tsx
// ✅ ACCEPTABLE: Critical TODO or technical debt
export default component$(() => {
  const data = useSignal([]);
  
  // TODO: Replace with proper API call before production
  const fetchData = $(() => {
    data.value = mockData;
  });

  // HACK: Workaround for Qwik bug #1234 - remove when fixed
  const workaroundFunction = $(() => {
    // specific technical workaround
  });

  return <div>{/* template */}</div>;
});

// ❌ FORBIDDEN: Explaining obvious code
export default component$(() => {
  // Get developers from context
  const { developers } = useDeveloper();
  
  // Filter developers
  const validDevelopers = useComputed$(() => 
    developers.filter(dev => dev.frameworks.length > 0)
  );

  // Handle delete function
  const handleDelete = $(async (id: string) => {
    await deleteDeveloper(id);
  });

  // Return the template
  return <div>{/* obvious template */}</div>;
});
```

**Why no comments?**
- Code should be self-documenting
- Good variable and function names explain intent
- Comments often become outdated and misleading
- Clean code is easier to read and maintain

## 🛠️ CSS Architecture

### Variable Organization

Structure CSS variables in organized files:

```css
/* styles/variables/colors.css */
:root {
  /* Primary Colors */
  --color-primary-blue: #667eea;
  --color-primary-purple: #764ba2;
  
  /* Status Colors */
  --color-success: #10b981;
  --color-error: #ef4444;
  
  /* Badge Colors */
  --color-badge-junior-bg: #dbeafe;
  --color-badge-junior-text: #1e40af;
  --color-badge-senior-bg: #d1fae5;
  --color-badge-senior-text: #065f46;
}
```

### Utility Classes (Simple & Purposeful)

Create utility classes that group related properties:

```css
/* styles/utilities/buttons.css */
.btn {
  border: none;
  border-radius: var(--border-radius-md);
  padding: 12px 20px;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary-blue), var(--color-primary-purple));
  color: var(--color-white);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.card {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: 24px;
  box-shadow: 0 4px 6px -1px var(--color-shadow-medium);
  transition: all 0.3s ease;
}
```

## 🔄 Development Workflow

### Pre-commit Checklist

Before committing code, ensure:

1. **Format Code**: Use Prettier in VS Code
   - First time: Right-click → "Format Document With..." → "Prettier"
   - After that: Right-click → "Format Document" 
   - Or use shortcut: `Alt + Shift + F`

2. **Type Check**: Ensure TypeScript passes
   ```bash
   npm run build
   ```

4. **Remove Unused Imports**: Clean up imports manually or with VS Code
5. **Remove Console Logs**: Remove debugging code
6. **Test Functionality**: Verify components work as expected

### Git Commit Messages

Use descriptive commit messages:

```bash
# ✅ GOOD
git commit -m "feat: add developer filtering by framework"
git commit -m "fix: resolve modal close state issue"
git commit -m "style: update button hover animations"
git commit -m "refactor: extract developer validation logic"

# ❌ BAD
git commit -m "fix stuff"
git commit -m "update"
git commit -m "changes"
```

## 📋 Component Checklist

When creating a new component, ensure:

- [ ] Follow proper import order
- [ ] Use BEM naming for CSS classes
- [ ] Structure component logic correctly (context → signals → computed → functions → tasks)
- [ ] Use unique keys for mapped elements
- [ ] Remove unused imports and comments
- [ ] Format code with Prettier
- [ ] Add proper TypeScript types
- [ ] Use CSS variables instead of hardcoded values
- [ ] Test component functionality

## 🎯 Example: Complete Component Structure

```tsx
// developers/developers.tsx
import { component$, useComputed$ } from '@builder.io/qwik';

import { useDeveloper } from '~/contexts/use-developer';

import styles from './developers.module.css';

import Developer from './developer/developer';

export default component$(() => {
  const { devStore, editDeveloper, removeDeveloper } = useDeveloper();
  
  const activeDevelopers = useComputed$(() => 
    devStore.developers.filter(dev => dev.isActive)
  );

  return (
    <div class={styles.developers}>
      {activeDevelopers.value.map((developer) => (
        <Developer
          key={developer.id}
          developer={developer}
          onEdit={editDeveloper}
          onDelete={removeDeveloper}
        />
      ))}
    </div>
  );
});
```

---

## 🚀 Quick Start

This project demonstrates these best practices with a developer management application.

### Development

```shell
npm start # or `yarn start`
```

### Production Build

```shell
npm run build # or `yarn build`
```

### Code Quality

```shell
npm run build # Type check
```

This guide ensures consistent, maintainable, and performant Qwik.js applications! 🚀
