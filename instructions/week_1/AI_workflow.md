# Copilot Instructions - React + TypeScript + Tailwind

## Project Overview

This is a modern frontend project built with React, TypeScript, and Tailwind CSS. Follow these guidelines to maintain code quality, consistency, and best practices.

---

## Core Principles

### Code Quality
- Write clean, readable, and maintainable code
- Prioritize type safety - leverage TypeScript's full potential
- Follow functional programming principles where applicable
- Keep components small, focused, and reusable
- Apply SOLID principles to component design

### Performance First
- Implement code splitting and lazy loading for routes
- Memoize expensive computations with `useMemo` and `useCallback`
- Use React.memo for components that re-render frequently
- Optimize images and assets (WebP, lazy loading)
- Minimize bundle size - analyze with webpack-bundle-analyzer

---

## TypeScript Best Practices

### Type Definitions
- Always define explicit types for props, state, and function returns
- Use interfaces for object shapes, types for unions/primitives
- Leverage utility types: `Partial<T>`, `Pick<T>`, `Omit<T>`, `Record<K, V>`
- Avoid `any` - use `unknown` if type is truly unknown
- Create strict types for API responses and external data

```typescript
// ✅ Good
interface UserProps {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

// ❌ Avoid
const user: any = { /* ... */ };
```

### Type Organization
- Store shared types in `src/types/` directory
- Co-locate component-specific types with components
- Use discriminated unions for complex state
- Export types that are reused across files

---

## React Component Guidelines

### Component Structure
- Use functional components with hooks
- Follow this file structure order:
  1. Imports (external, then internal)
  2. Type definitions
  3. Component definition
  4. Styled components (if any)
  5. Exports

```typescript
// External imports
import { useState, useEffect } from 'react';

// Internal imports
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

// Types
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// Component
export const Component = ({ title, onAction }: ComponentProps) => {
  // Hooks
  const [state, setState] = useState(false);
  
  // Effects
  useEffect(() => {
    // ...
  }, []);
  
  // Handlers
  const handleClick = () => {
    onAction();
  };
  
  // Render
  return <div>{title}</div>;
};
```

### Hooks Best Practices
- Custom hooks should start with `use` prefix
- Extract complex logic into custom hooks
- Keep hooks at the top of components
- Follow rules of hooks (no conditional calls)
- Use dependency arrays correctly in useEffect

```typescript
// ✅ Good - Custom hook
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

### Component Patterns
- Use composition over inheritance
- Implement compound components for complex UI
- Leverage render props and children when appropriate
- Keep components pure when possible
- Extract repeated JSX into separate components

---

## Tailwind CSS Guidelines

### Class Organization
- Order classes logically: layout → spacing → sizing → colors → typography → effects
- Use Tailwind's official Prettier plugin for automatic sorting
- Group related utilities with parentheses in complex scenarios

```tsx
// ✅ Good - Organized classes
<div className="flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">

// ❌ Avoid - Unorganized
<div className="shadow-md bg-white px-4 rounded-lg flex py-2 items-center hover:shadow-lg justify-between transition-shadow">
```

### Custom Styles
- Define custom colors, spacing, and utilities in `tailwind.config.js`
- Use CSS variables for theme values that need runtime changes
- Avoid inline styles - use Tailwind utilities
- Create custom variants sparingly

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
};
```

### Responsive Design
- Mobile-first approach by default
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Test all breakpoints during development
- Avoid excessive breakpoint variants

```tsx
// ✅ Good - Mobile first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ❌ Avoid - Desktop first
<div className="grid grid-cols-3 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
```

### Component Variants
- Use `clsx` or `classnames` for conditional classes
- Consider using `cva` (class-variance-authority) for complex variant systems
- Keep variant logic clean and readable

```typescript
import { clsx } from 'clsx';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const Button = ({ variant = 'primary', size = 'md' }: ButtonProps) => (
  <button
    className={clsx(
      'rounded font-medium transition-colors',
      {
        'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
        'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
        'px-3 py-1.5 text-sm': size === 'sm',
        'px-4 py-2 text-base': size === 'md',
        'px-6 py-3 text-lg': size === 'lg',
      }
    )}
  />
);
```

---

## Design Patterns

### Container/Presenter Pattern
- Separate logic (Container) from UI (Presenter)
- Containers handle data fetching and state management
- Presenters focus purely on rendering
```typescript
// Container
const UserProfileContainer = () => {
  const { user, isLoading } = useUser();
  const handleEdit = () => { /* logic */ };
  
  return <UserProfilePresenter user={user} isLoading={isLoading} onEdit={handleEdit} />;
};

// Presenter
interface UserProfilePresenterProps {
  user: User | null;
  isLoading: boolean;
  onEdit: () => void;
}

const UserProfilePresenter = ({ user, isLoading, onEdit }: UserProfilePresenterProps) => {
  if (isLoading) return <Skeleton />;
  if (!user) return <EmptyState />;
  
  return (/* Pure UI */);
};
```

### Compound Component Pattern
- Related components that work together
- Share implicit state without prop drilling
```typescript
const Tabs = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

Tabs.List = ({ children }: { children: ReactNode }) => (
  <div className="flex border-b">{children}</div>
);

Tabs.Tab = ({ index, children }: { index: number; children: ReactNode }) => {
  const { activeTab, setActiveTab } = useTabsContext();
  return (
    <button
      onClick={() => setActiveTab(index)}
      className={activeTab === index ? 'active' : ''}
    >
      {children}
    </button>
  );
};

// Usage
<Tabs>
  <Tabs.List>
    <Tabs.Tab index={0}>Tab 1</Tabs.Tab>
    <Tabs.Tab index={1}>Tab 2</Tabs.Tab>
  </Tabs.List>
</Tabs>
```

### Higher-Order Component (HOC) Pattern
- Wrap components to add functionality
- Use sparingly - prefer hooks for most cases
```typescript
const withAuth = <P extends object>(Component: ComponentType<P>) => {
  return (props: P) => {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) return <Navigate to="/login" />;
    
    return <Component {...props} />;
  };
};

// Usage
const Dashboard = withAuth(DashboardComponent);
```

### Factory Pattern
- Create components dynamically based on type
- Useful for forms, charts, or dynamic content
```typescript
type FieldType = 'text' | 'email' | 'select' | 'checkbox';

interface FieldConfig {
  type: FieldType;
  name: string;
  label: string;
  options?: string[];
}

const FieldFactory = ({ type, ...props }: FieldConfig) => {
  const fields = {
    text: TextInput,
    email: EmailInput,
    select: SelectInput,
    checkbox: CheckboxInput,
  };
  
  const Component = fields[type];
  return <Component {...props} />;
};
```

### Observer Pattern (Pub/Sub)
- Use for event-driven architecture
- Custom event bus for cross-component communication
```typescript
type EventCallback = (data: any) => void;

class EventBus {
  private events: Map<string, EventCallback[]> = new Map();
  
  subscribe(event: string, callback: EventCallback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }
  
  publish(event: string, data: any) {
    this.events.get(event)?.forEach(callback => callback(data));
  }
  
  unsubscribe(event: string, callback: EventCallback) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      this.events.set(event, callbacks.filter(cb => cb !== callback));
    }
  }
}

export const eventBus = new EventBus();
```
---

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # Base UI components (Button, Input, Card)
│   ├── layout/         # Layout components (Header, Footer, Sidebar)
│   └── features/       # Feature-specific components
├── hooks/              # Custom React hooks
├── pages/              # Page components (if using React Router)
├── services/           # API calls and external services
├── types/              # Shared TypeScript types
├── utils/              # Utility functions
├── constants/          # App constants
├── contexts/           # React contexts
├── lib/                # Third-party library configurations
└── styles/             # Global styles and Tailwind config
```

---

## State Management

### Local State
- Use `useState` for simple component state
- Use `useReducer` for complex state logic
- Lift state up only when necessary

### Global State
- Use React Context for theme, auth, user preferences
- Consider Zustand, Jotai, or Redux Toolkit for complex global state
- Keep global state minimal - prefer local state

```typescript
// ✅ Good - Context example
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

---

## API & Data Fetching

### Best Practices
- Use React Query (TanStack Query) or SWR for server state
- Implement proper loading and error states
- Handle race conditions and cleanup
- Type API responses strictly

```typescript
import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
}

const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async (): Promise<User> => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
  });
};
```

---

## Testing

### Testing Strategy
- Write unit tests for utilities and custom hooks
- Write integration tests for components
- Use React Testing Library for component tests
- Avoid implementation details - test behavior

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

describe('Button', () => {
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## Accessibility

### Requirements
- Use semantic HTML elements
- Provide ARIA labels where needed
- Ensure keyboard navigation works
- Maintain proper heading hierarchy
- Test with screen readers
- Ensure color contrast meets WCAG AA standards

```tsx
// ✅ Good
<button
  onClick={handleClose}
  aria-label="Close dialog"
  className="p-2 rounded hover:bg-gray-100"
>
  <XIcon className="w-5 h-5" />
</button>

// ❌ Avoid
<div onClick={handleClose}>
  <XIcon />
</div>
```

---

## Performance Optimization

### Code Splitting
```typescript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Dashboard />
    </Suspense>
  );
}
```

### Memoization
```typescript
// ✅ Use memo for expensive components
const ExpensiveComponent = memo(({ data }: Props) => {
  // Expensive rendering logic
});

// ✅ Use useMemo for expensive calculations
const sortedData = useMemo(
  () => data.sort((a, b) => a.value - b.value),
  [data]
);

// ✅ Use useCallback for event handlers passed to children
const handleClick = useCallback(() => {
  console.log(value);
}, [value]);
```

---

## Error Handling

### Error Boundaries
```typescript
class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

---

## Anti-Patterns to Avoid

### God Components
- ❌ Components with 300+ lines
- ❌ Components that do data fetching, business logic, and complex UI
- ✅ Break into smaller, focused components

### Prop Drilling Hell
- ❌ Passing props through 4+ levels
- ✅ Use Context or state management

### Premature Optimization
- ❌ Memoizing everything
- ❌ Over-engineering simple components
- ✅ Optimize only when performance issues are measured

### Magic Numbers/Strings
```typescript
// ❌ Avoid
if (user.role === 'admin') { }
setTimeout(() => {}, 3000);

// ✅ Good
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

const TIMERS = {
  NOTIFICATION_DELAY: 3000,
} as const;

if (user.role === USER_ROLES.ADMIN) { }
setTimeout(() => {}, TIMERS.NOTIFICATION_DELAY);
```

### Mutating State Directly
```typescript
// ❌ Avoid
const handleAdd = () => {
  items.push(newItem); // Mutation!
  setItems(items);
};

// ✅ Good
const handleAdd = () => {
  setItems([...items, newItem]);
};
```
---

## Git Conventions

### Commit Messages
- Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- Write clear, concise commit messages
- Reference issue numbers when applicable

```
feat(auth): add password reset functionality
fix(dashboard): correct chart rendering issue
docs(readme): update installation instructions
```

---

## Code Review Checklist

- [ ] TypeScript types are properly defined
- [ ] Components are properly typed and documented
- [ ] Tailwind classes are organized and semantic
- [ ] No console.logs in production code
- [ ] Accessibility considerations addressed
- [ ] Performance optimizations applied where needed
- [ ] Error handling implemented
- [ ] Tests written for new features
- [ ] Code follows project conventions
- [ ] No unnecessary dependencies added

---

## Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query)
- [Testing Library](https://testing-library.com/react)

---

**Remember**: Write code that your future self and teammates will thank you for. Prioritize clarity over cleverness, and consistency over personal preference.
### SOLID Principles in React

#### Single Responsibility Principle (SRP)
- Each component should have one reason to change
- Separate data fetching, business logic, and presentation
- Extract complex logic into custom hooks or utility functions
```typescript
// ❌ Avoid - Component doing too much
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    // Fetching user
    fetch('/api/user').then(res => setUser(res));
    // Fetching posts
    fetch('/api/posts').then(res => setPosts(res));
    // Analytics tracking
    trackPageView();
  }, []);
  
  return (/* complex JSX with business logic */);
};

// ✅ Good - Separated concerns
const UserProfile = () => {
  const { user } = useUser();
  const { posts } = useUserPosts(user?.id);
  
  usePageTracking('user-profile');
  
  return <UserProfileView user={user} posts={posts} />;
};
```

#### Open/Closed Principle (OCP)
- Components should be open for extension, closed for modification
- Use composition and props for flexibility
- Leverage render props and children patterns
```typescript
// ❌ Avoid - Modifying component for new features
const Button = ({ type }: { type: 'primary' | 'secondary' | 'danger' | 'success' }) => {
  // Keep adding more types...
};

// ✅ Good - Extensible through props
interface ButtonProps {
  variant?: string;
  className?: string;
  children: ReactNode;
}

const Button = ({ variant = 'primary', className, children }: ButtonProps) => (
  <button className={clsx(baseStyles, variantStyles[variant], className)}>
    {children}
  </button>
);
```

#### Liskov Substitution Principle (LSP)
- Child components should be substitutable for parent components
- Maintain consistent prop interfaces across similar components
- Don't break expected behavior in derived components
```typescript
// ✅ Good - Consistent interface
interface BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const TextInput = (props: BaseInputProps) => { /* */ };
const EmailInput = (props: BaseInputProps) => { /* */ };
const PasswordInput = (props: BaseInputProps) => { /* */ };
```

#### Interface Segregation Principle (ISP)
- Don't force components to depend on props they don't use
- Create specific, focused prop interfaces
- Split large interfaces into smaller ones
```typescript
// ❌ Avoid - Bloated interface
interface UserCardProps {
  user: User;
  showEmail: boolean;
  showPhone: boolean;
  showAddress: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
  // Too many optional props...
}

// ✅ Good - Segregated interfaces
interface UserCardProps {
  user: Pick<User, 'id' | 'name' | 'avatar'>;
}

interface EditableUserCardProps extends UserCardProps {
  onEdit: () => void;
  onDelete: () => void;
}

interface ContactInfoProps {
  email?: string;
  phone?: string;
}
```

#### Dependency Inversion Principle (DIP)
- Depend on abstractions (interfaces/types), not concrete implementations
- Inject dependencies rather than hard-coding them
- Use dependency injection for services and utilities
```typescript
// ❌ Avoid - Direct dependency
const UserList = () => {
  const fetchUsers = async () => {
    return fetch('/api/users').then(res => res.json());
  };
  // ...
};

// ✅ Good - Abstracted dependency
interface UserService {
  getUsers: () => Promise<User[]>;
}

const UserList = ({ userService }: { userService: UserService }) => {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers
  });
  // ...
};
```

