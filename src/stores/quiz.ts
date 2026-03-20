import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Book, Chapter, Question, QuizResult } from '@/types'
import booksData from '@/data/books.json'

export const useQuizStore = defineStore('quiz', () => {
  // State
  const currentBookId = ref<string>('')
  const currentChapterId = ref<string>('')
  const currentQuestions = ref<Question[]>([])
  const currentQuestionIndex = ref(0)
  const answers = ref<Record<string, number[]>>({})
  const isFinished = ref(false)
  const startTime = ref<number>(0)
  const timeSpent = ref<number>(0)

  // Getters
  const allBooks = computed<Book[]>(() => booksData as Book[])

  const currentBook = computed<Book | null>(() => {
    return allBooks.value.find(b => b.id === currentBookId.value) || null
  })

  const currentChapter = computed<Chapter | null>(() => {
    if (!currentBook.value) return null
    return currentBook.value.chapters.find(c => c.id === currentChapterId.value) || null
  })

  const currentQuestion = computed<Question | null>(() => {
    if (currentQuestions.value.length === 0) return null
    return currentQuestions.value[currentQuestionIndex.value]
  })

  const currentAnswer = computed<number[]>(() => {
    return answers.value[currentQuestionIndex.value.toString()] || []
  })

  const hasAnsweredCurrent = computed<boolean>(() => {
    return (answers.value[currentQuestionIndex.value.toString()]?.length || 0) > 0
  })

  const isFirstQuestion = computed<boolean>(() => currentQuestionIndex.value === 0)

  const isLastQuestion = computed<boolean>(() => {
    return currentQuestionIndex.value === currentQuestions.value.length - 1
  })

  const progress = computed(() => {
    const total = currentQuestions.value.length
    const current = currentQuestionIndex.value + 1
    return {
      current,
      total,
      percentage: total > 0 ? Math.round((current / total) * 100) : 0
    }
  })

  const quizResult = computed<QuizResult | null>(() => {
    if (!isFinished.value) return null

    let correctCount = 0
    currentQuestions.value.forEach((question, index) => {
      const userAnswer = answers.value[index.toString()] || []
      const correctAnswer = question.answer.map(a => parseInt(a))
      
      // Sort both arrays for comparison
      const sortedUser = [...userAnswer].sort()
      const sortedCorrect = [...correctAnswer].sort()
      
      if (sortedUser.length === sortedCorrect.length &&
          sortedUser.every((a, i) => a === sortedCorrect[i])) {
        correctCount++
      }
    })

    const totalQuestions = currentQuestions.value.length
    const wrongCount = totalQuestions - correctCount
    const score = Math.round((correctCount / totalQuestions) * 100)
    const accuracy = score

    return {
      totalQuestions,
      correctCount,
      wrongCount,
      score,
      accuracy,
      percentage: score,
      timeSpent: timeSpent.value
    }
  })

  // Actions
  function startQuiz(bookId: string, chapterId: string, questions: Question[]) {
    currentBookId.value = bookId
    currentChapterId.value = chapterId
    currentQuestions.value = questions
    currentQuestionIndex.value = 0
    answers.value = {}
    isFinished.value = false
    startTime.value = Date.now()
    timeSpent.value = 0
  }

  function setAnswer(questionIndex: number, answer: number[]) {
    answers.value[questionIndex.toString()] = answer
  }

  function toggleAnswerOption(questionIndex: number, optionIndex: number) {
    const current = answers.value[questionIndex.toString()] || []
    if (current.includes(optionIndex)) {
      answers.value[questionIndex.toString()] = current.filter(i => i !== optionIndex)
    } else {
      answers.value[questionIndex.toString()] = [...current, optionIndex]
    }
  }

  function nextQuestion() {
    if (!isLastQuestion.value) {
      currentQuestionIndex.value++
    }
  }

  function prevQuestion() {
    if (!isFirstQuestion.value) {
      currentQuestionIndex.value--
    }
  }

  function goToQuestion(index: number) {
    if (index >= 0 && index < currentQuestions.value.length) {
      currentQuestionIndex.value = index
    }
  }

  function finishQuiz() {
    timeSpent.value = Math.floor((Date.now() - startTime.value) / 1000)
    isFinished.value = true
  }

  function resetQuiz() {
    currentQuestionIndex.value = 0
    answers.value = {}
    isFinished.value = false
    timeSpent.value = 0
  }

  function isCorrect(questionId: string): boolean {
    const question = currentQuestions.value.find(q => q.id === questionId)
    if (!question) return false
    const index = currentQuestions.value.findIndex(q => q.id === questionId)
    const userAnswer = answers.value[index.toString()] || []
    const correctAnswer = question.answer.map(a => parseInt(a))
    
    const sortedUser = [...userAnswer].sort()
    const sortedCorrect = [...correctAnswer].sort()
    
    return sortedUser.length === sortedCorrect.length &&
           sortedUser.every((a, i) => a === sortedCorrect[i])
  }

  function getCorrectAnswer(questionId: string): string[] {
    const question = currentQuestions.value.find(q => q.id === questionId)
    return question?.answer || []
  }

  return {
    // State
    currentBookId,
    currentChapterId,
    currentQuestions,
    currentQuestionIndex,
    answers,
    isFinished,
    timeSpent,
    // Getters
    allBooks,
    currentBook,
    currentChapter,
    currentQuestion,
    currentAnswer,
    hasAnsweredCurrent,
    isFirstQuestion,
    isLastQuestion,
    progress,
    quizResult,
    // Actions
    startQuiz,
    setAnswer,
    toggleAnswerOption,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    finishQuiz,
    resetQuiz,
    isCorrect,
    getCorrectAnswer
  }
})
