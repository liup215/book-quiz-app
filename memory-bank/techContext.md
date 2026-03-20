# Technical Context

## Technology Stack
The Book Quiz App is built using a modern web development stack:

### Core Frameworks and Libraries
- **Vue 3**: Primary frontend framework using Composition API
- **Vue Router**: Client-side routing for SPA navigation
- **Pinia**: State management library for Vue applications
- **TypeScript**: Static typing for improved code quality and developer experience
- **Vite**: Next-generation build tool for fast development and production builds

### Styling and Design
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **PostCSS**: CSS processing pipeline with Autoprefixer for browser compatibility
- **Custom CSS**: Additional styling for global elements like scrollbars and line clamping

### Development Tools
- **vue-tsc**: TypeScript compiler specifically for Vue projects
- **npm-run-all2**: Parallel script execution for development workflows
- **Vue DevTools**: Browser extension for debugging Vue applications

### Build and Deployment
- **Vite**: Handles both development server and production builds
- **ESBuild**: Underlying bundler for extremely fast builds
- **Static Site Generation**: Production builds create static HTML/CSS/JS files

## Project Structure
```
book-quiz-app/
├── public/                 # Static assets (favicon, etc.)
├── src/
│   ├── assets/            # Global assets (CSS, images, SVG)
│   ├── components/        # Reusable Vue components
│   │   └── icons/         # Icon components
│   ├── data/              # Static data files
│   │   ├── books.json     # Book metadata
│   │   └── questions/     # Question data by book
│   ├── router/            # Routing configuration
│   ├── stores/            # Pinia stores
│   ├── types/             # TypeScript type definitions
│   ├── views/             # Top-level page components
│   ├── App.vue            # Root component
│   └── main.ts            # Application entry point
├── books/                 # Source book content (Markdown files)
├── index.html             # Main HTML template
└── vite.config.ts         # Vite configuration
```

## Configuration Files
### TypeScript Configuration
- **tsconfig.json**: Root TypeScript configuration
- **tsconfig.app.json**: App-specific TypeScript settings
- **tsconfig.node.json**: Node.js environment TypeScript settings
- **env.d.ts**: Global type declarations for Vite environment

### Build Configuration
- **vite.config.ts**: Vite build configuration with Vue plugin
- **postcss.config.js**: PostCSS configuration for Tailwind and Autoprefixer
- **tailwind.config.js**: Tailwind CSS customization and plugin configuration

### Package Management
- **package.json**: Dependencies, scripts, and project metadata
- **package-lock.json**: Dependency lock file for reproducible installs

## Development Workflow
### Setup
```bash
npm install
```

### Development
```bash
npm run dev          # Start development server with hot reload
npm run type-check   # Run TypeScript type checking
```

### Production Build
```bash
npm run build        # Build for production with minification
npm run preview      # Preview production build locally
```

## Type System
The application uses TypeScript with comprehensive type definitions:

### Key Types
- **Book**: Book metadata structure
- **Chapter**: Chapter information within books
- **Question**: Quiz question with options and answers
- **QuizResult**: Computed quiz results structure

### Type Safety Features
- Strict TypeScript configuration
- Vue-specific type support via `vue-tsc`
- Interface-based data structures for consistency
- Type-safe store interactions

## Data Management
### Static Data Approach
- Book metadata stored in `src/data/books.json`
- Questions organized by book in `src/data/questions/`
- No external API dependencies - all data is bundled with the app
- Easy to extend by adding new JSON files

### State Management Best Practices
- Single source of truth via Pinia store
- Immutable state updates through action methods
- Computed properties for derived state
- Type-safe store access throughout components

## Performance Characteristics
- **Fast Initial Load**: Vite's optimized development server
- **Code Splitting**: Route-based lazy loading reduces bundle size
- **Efficient Updates**: Vue 3's reactivity system minimizes DOM updates
- **Static Assets**: All data bundled as static files for CDN delivery

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features supported via Vite's build process
- Responsive design works on mobile and desktop devices

## Testing Strategy
Currently, the project doesn't include automated tests, but the architecture supports:
- Unit testing of Pinia stores
- Component testing with Vue Test Utils
- End-to-end testing with tools like Cypress or Playwright