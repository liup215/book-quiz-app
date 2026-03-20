<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'
import type { Question } from '@/types'
import booksData from '@/data/books.json'

const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()

const bookId = computed(() => (route.params.bookId as string) || '')
const chapterId = computed(() => (route.params.chapterId as string) || '')
const book = computed(() => booksData.find((b: any) => b.id === bookId.value))
const chapter = computed(() => book.value?.chapters.find((c: any) => c.id === chapterId.value))

const questions = ref<Question[]>([])
const showExplanation = ref(false)
const isSubmitting = ref(false)

const currentQuestion = computed(() => questions.value[quizStore.currentQuestionIndex] || null)
const isFirstQuestion = computed(() => quizStore.currentQuestionIndex === 0)
const isLastQuestion = computed(() => quizStore.currentQuestionIndex === questions.value.length - 1)
const hasAnswered = computed(() => quizStore.hasAnsweredCurrent)
const allQuestionsAnswered = computed(() => {
  return questions.value.every((_, index) => {
    const answer = quizStore.answers[index.toString()]
    return answer && answer.length > 0
  })
})

onMounted(async () => {
  try {
    const questionsData = await import(`@/data/questions/${bookId.value}.json`)
    questions.value = questionsData.default.chapters[chapterId.value] || []
    
    if (questions.value.length > 0) {
      quizStore.startQuiz(bookId.value, chapterId.value, questions.value)
    }
  } catch (error) {
    console.error('Failed to load questions:', error)
  }
})

function selectOption(optionIndex: number) {
  if (showExplanation.value) return
  
  const question = currentQuestion.value
  if (!question) return
  
  if (question.type === 'single' || question.type === 'boolean') {
    // 单选和判断题：直接设置答案
    quizStore.setAnswer(quizStore.currentQuestionIndex, [optionIndex])
  } else if (question.type === 'multiple') {
    // 多选题：切换选项
    quizStore.toggleAnswerOption(quizStore.currentQuestionIndex, optionIndex)
  }
}

function isSelected(optionIndex: number): boolean {
  const answer = quizStore.currentAnswer
  return answer.includes(optionIndex)
}

function isCorrectOption(optionIndex: number): boolean {
  const question = currentQuestion.value
  if (!question) return false
  
  const correctAnswer = Array.isArray(question.answer) ? question.answer : [question.answer]
  return correctAnswer.includes(optionIndex)
}

function getOptionClass(optionIndex: number): string {
  const baseClass = 'w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-start'
  
  if (!showExplanation.value) {
    // 答题中状态
    if (isSelected(optionIndex)) {
      return `${baseClass} border-indigo-500 bg-indigo-50 text-indigo-900`
    }
    return `${baseClass} border-gray-200 hover:border-indigo-300 hover:bg-gray-50 text-gray-700`
  }
  
  // 显示解析状态
  if (isCorrectOption(optionIndex)) {
    return `${baseClass} border-green-500 bg-green-50 text-green-900`
  }
  
  if (isSelected(optionIndex) && !isCorrectOption(optionIndex)) {
    return `${baseClass} border-red-500 bg-red-50 text-red-900`
  }
  
  return `${baseClass} border-gray-200 text-gray-400`
}

function getQuestionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    single: '单选题',
    multiple: '多选题',
    boolean: '判断题'
  }
  return labels[type] || type
}

function getQuestionTypeClass(type: string): string {
  const classes: Record<string, string> = {
    single: 'bg-blue-100 text-blue-800',
    multiple: 'bg-purple-100 text-purple-800',
    boolean: 'bg-orange-100 text-orange-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

function checkAnswer() {
  showExplanation.value = true
}

function nextQuestion() {
  showExplanation.value = false
  quizStore.nextQuestion()
}

function prevQuestion() {
  showExplanation.value = false
  quizStore.prevQuestion()
}

function goToQuestion(index: number) {
  showExplanation.value = false
  quizStore.goToQuestion(index)
}

function finishQuiz() {
  isSubmitting.value = true
  quizStore.finishQuiz()
}

function restartQuiz() {
  quizStore.resetQuiz()
  if (questions.value.length > 0) {
    quizStore.startQuiz(bookId.value, chapterId.value, questions.value)
  }
  showExplanation.value = false
  isSubmitting.value = false
}

function goBack() {
  router.push(`/book/${bookId.value}`)
}

function goHome() {
  router.push('/')
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}分${secs}秒`
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <button
            @click="goBack"
            class="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span class="font-medium">返回</span>
          </button>
          <div class="text-center">
            <h1 class="text-lg font-bold text-gray-900">{{ book?.title }}</h1>
            <p class="text-sm text-gray-500">{{ chapter?.title }}</p>
          </div>
          <div class="w-16"></div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Quiz Result -->
      <div v-if="quizStore.isFinished && quizStore.quizResult" class="mb-8">
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
              :class="quizStore.quizResult.score >= 80 ? 'bg-green-100' : quizStore.quizResult.score >= 60 ? 'bg-yellow-100' : 'bg-red-100'"
            >
              <span class="text-3xl font-bold"
                :class="quizStore.quizResult.score >= 80 ? 'text-green-600' : quizStore.quizResult.score >= 60 ? 'text-yellow-600' : 'text-red-600'"
              >
                {{ quizStore.quizResult.score }}
              </span>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">答题完成！</h2>
            <p class="text-gray-600">
              用时 {{ formatTime(quizStore.quizResult.timeSpent) }}
            </p>
          </div>
          
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="text-center p-4 bg-gray-50 rounded-xl">
              <p class="text-2xl font-bold text-gray-900">{{ quizStore.quizResult.totalQuestions }}</p>
              <p class="text-sm text-gray-500">总题数</p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-xl">
              <p class="text-2xl font-bold text-green-600">{{ quizStore.quizResult.correctCount }}</p>
              <p class="text-sm text-green-600">正确</p>
            </div>
            <div class="text-center p-4 bg-red-50 rounded-xl">
              <p class="text-2xl font-bold text-red-600">{{ quizStore.quizResult.wrongCount }}</p>
              <p class="text-sm text-red-600">错误</p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <button
              @click="restartQuiz"
              class="flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              重新答题
            </button>
            <button
              @click="goHome"
              class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>

      <!-- Quiz Content -->
      <div v-else-if="questions.length > 0">
        <!-- Progress Bar -->
        <div class="bg-white rounded-xl shadow-md p-4 mb-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">
              进度 {{ quizStore.progress.current }}/{{ quizStore.progress.total }}
            </span>
            <span class="text-sm font-medium text-indigo-600">
              {{ quizStore.progress.percentage }}%
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${quizStore.progress.percentage}%` }"
            ></div>
          </div>
        </div>

        <!-- Question Card -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <!-- Question Header -->
          <div class="flex items-start justify-between mb-6">
            <div>
              <span
                class="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2"
                :class="getQuestionTypeClass(currentQuestion.type)"
              >
                {{ getQuestionTypeLabel(currentQuestion.type) }}
              </span>
              <h2 class="text-lg font-semibold text-gray-900 leading-relaxed">
                {{ quizStore.currentQuestionIndex + 1 }}. {{ currentQuestion.question }}
              </h2>
            </div>
          </div>

          <!-- Options -->
          <div class="space-y-3">
            <button
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              @click="selectOption(index)"
              :class="getOptionClass(index)"
              :disabled="showExplanation"
            >
              <span class="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3 font-medium"
                :class="isSelected(index) ? 'border-current' : 'border-gray-300 text-gray-500'"
              >
                {{ ['A', 'B', 'C', 'D', 'E', 'F'][index] }}
              </span>
              <span class="flex-1">{{ option }}</span>
              <span v-if="showExplanation && isCorrectOption(index)" class="ml-2 text-green-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span v-if="showExplanation && isSelected(index) && !isCorrectOption(index)" class="ml-2 text-red-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </button>
          </div>

          <!-- Explanation -->
          <div v-if="showExplanation" class="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 class="font-semibold text-blue-900 mb-2 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              答案解析
            </h3>
            <p class="text-blue-800 leading-relaxed">{{ currentQuestion.explanation }}</p>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex items-center justify-between">
          <button
            @click="prevQuestion"
            :disabled="isFirstQuestion"
            class="px-6 py-3 rounded-xl font-medium transition-colors flex items-center"
            :class="isFirstQuestion ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            上一题
          </button>

          <div v-if="!showExplanation" class="flex gap-2">
            <button
              v-if="hasAnswered"
              @click="checkAnswer"
              class="px-6 py-3 bg-indigo-100 text-indigo-700 font-medium rounded-xl hover:bg-indigo-200 transition-colors"
            >
              查看解析
            </button>
          </div>

          <button
            v-if="!isLastQuestion"
            @click="nextQuestion"
            class="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center shadow-md"
          >
            下一题
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            v-else
            @click="finishQuiz"
            :disabled="!allQuestionsAnswered"
            class="px-6 py-3 font-medium rounded-xl transition-colors flex items-center shadow-md"
            :class="allQuestionsAnswered ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            提交答卷
          </button>
        </div>

        <!-- Question Navigator -->
        <div class="mt-8 bg-white rounded-xl shadow-md p-4">
          <h3 class="text-sm font-medium text-gray-700 mb-3">题目导航</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(_, index) in questions"
              :key="index"
              @click="goToQuestion(index)"
              class="w-10 h-10 rounded-lg font-medium text-sm transition-colors"
              :class="[
                quizStore.currentQuestionIndex === index
                  ? 'bg-indigo-600 text-white'
                  : quizStore.answers[index.toString()]?.length > 0
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              {{ index + 1 }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading/Error State -->
      <div v-else class="text-center py-16">
        <svg class="mx-auto h-12 w-12 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-4 text-gray-500">加载题目中...</p>
      </div>
    </main>
  </div>
</template>
