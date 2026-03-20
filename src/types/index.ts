export interface Book {
  id: string
  title: string
  author: string
  cover: string
  description: string
  chapters: Chapter[]
}

export interface Chapter {
  id: string
  title: string
  description?: string
  questionCount: number
}

export type QuestionType = 'single' | 'multiple' | 'boolean'

export interface Option {
  id: string
  text: string
}

export interface Question {
  id: string
  type: QuestionType
  question: string
  options: Option[]
  answer: string[]
  explanation: string
}

export interface QuizState {
  currentQuestionIndex: number
  selectedAnswers: number[]
  answers: Record<number, number[]>
  showResult: boolean
  score: number
}

export interface QuizResult {
  totalQuestions: number
  correctCount: number
  wrongCount: number
  score: number
  timeSpent: number
}
