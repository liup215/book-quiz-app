# System Patterns

## Architecture Overview
The Book Quiz App follows a modern single-page application (SPA) architecture with clear separation of concerns:

- **View Layer**: Vue 3 components handle UI rendering and user interactions
- **Routing Layer**: Vue Router manages navigation between different views (Home, Book, Quiz)
- **State Management**: Pinia store centralizes quiz state and book data
- **Data Layer**: Static JSON files provide book metadata and quiz questions
- **Styling Layer**: Tailwind CSS provides utility-first styling with custom enhancements

## Component Structure
The application uses a hierarchical component structure:

### Top-Level Views
- **HomeView.vue**: Landing page displaying available books in a grid layout
- **BookView.vue**: Book detail page showing chapters and navigation to quizzes
- **QuizView.vue**: Interactive quiz interface with question display, answer selection, and results

### State Management Pattern
The `useQuizStore` implements a comprehensive state management pattern:

**State Properties:**
- `currentBookId`, `currentChapterId`: Track current context
- `currentQuestions`: Active question set for the current quiz
- `currentQuestionIndex`: Current position in the quiz
- `answers`: User's selected answers indexed by question
- `isFinished`: Quiz completion status
- `timeSpent`: Duration tracking for completed quizzes

**Computed Getters:**
- `allBooks`: Access to complete book catalog
- `currentBook`, `currentChapter`: Derived book/chapter objects
- `currentQuestion`, `currentAnswer`: Current quiz context
- `progress`: Percentage and count-based progress metrics
- `quizResult`: Comprehensive results calculation

**Action Methods:**
- `startQuiz()`: Initialize quiz state
- `setAnswer()`, `toggleAnswerOption()`: Handle answer selection
- `nextQuestion()`, `prevQuestion()`, `goToQuestion()`: Navigation controls
- `finishQuiz()`, `resetQuiz()`: Quiz lifecycle management
- `isCorrect()`, `getCorrectAnswer()`: Answer validation utilities

## Data Flow Patterns
1. **Book Selection**: HomeView → Router → BookView (with book ID parameter)
2. **Quiz Initiation**: BookView → QuizView (with book ID and chapter ID parameters)
3. **Question Loading**: QuizView loads questions from static JSON based on route parameters
4. **State Initialization**: QuizView calls `startQuiz()` to initialize store state
5. **User Interaction**: Answer selections update store via action methods
6. **Results Calculation**: Store automatically computes results when quiz is finished

## Routing Strategy
The application uses parameterized routing:
- `/`: Home view (book listing)
- `/book/:id`: Book detail view for specific book
- `/quiz/:bookId/:chapterId`: Quiz view for specific book chapter

Dynamic imports are used for route components to enable code splitting and improve initial load performance.

## Data Structure Patterns
### Book Data Structure
```typescript
interface Book {
  id: string
  title: string
  author: string
  cover: string
  description: string
  chapters: Chapter[]
}

interface Chapter {
  id: string
  title: string
  questionCount: number
}
```

### Question Data Structure
```typescript
interface Question {
  id: string
  type: 'single' | 'multiple' | 'boolean'
  question: string
  options: Option[]
  answer: string[] // Array of correct option IDs
  explanation: string
}

interface Option {
  id: string
  text: string
}
```

## UI/UX Patterns
- **Progressive Disclosure**: Show only relevant information at each step
- **Immediate Feedback**: Visual indication of correct/incorrect answers
- **Navigation Flexibility**: Users can move forward/backward or jump to any question
- **Responsive Design**: Mobile-first approach with Tailwind's responsive utilities
- **Accessibility**: Semantic HTML and proper ARIA attributes

## Performance Considerations
- **Lazy Loading**: Route components loaded on demand
- **Static Data**: Book and question data stored as static JSON files
- **Efficient State Updates**: Pinia's reactivity system ensures minimal re-renders
- **Memory Management**: Quiz state reset when navigating away from quiz view