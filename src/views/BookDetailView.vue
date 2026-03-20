<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center">
          <button
            @click="goBack"
            class="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ book?.title }}</h1>
            <p class="text-sm text-gray-500">作者：{{ book?.author }}</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="book" class="space-y-8">
        <!-- Book Info Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Book Cover -->
            <div class="w-full md:w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <div class="text-white text-center p-4">
                <div class="text-5xl mb-2">📖</div>
              </div>
            </div>

            <!-- Book Details -->
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ book.title }}</h2>
              <p class="text-gray-600 mb-4">{{ book.description }}</p>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span class="flex items-center">
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {{ book.author }}
                </span>
                <span class="flex items-center">
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {{ book.chapters.length }} 个章节
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chapters List -->
        <div class="bg-white rounded-lg shadow-md">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">章节列表</h3>
            <p class="text-sm text-gray-500 mt-1">选择章节开始刷题</p>
          </div>

          <div class="divide-y divide-gray-200">
            <div
              v-for="(chapter, index) in book.chapters"
              :key="chapter.id"
              class="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              @click="startQuiz(chapter.id)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <h4 class="text-lg font-medium text-gray-900">{{ chapter.title }}</h4>
                    <p class="text-sm text-gray-500 mt-1">{{ chapter.description }}</p>
                  </div>
                </div>
                <button
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  开始刷题
                  <svg class="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-12">
        <div class="text-6xl mb-4">😕</div>
        <h3 class="text-lg font-medium text-gray-900">书籍未找到</h3>
        <p class="text-gray-500 mt-2">该书籍不存在或已被删除</p>
        <button
          @click="goBack"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
        >
          返回首页
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'

const router = useRouter()
const route = useRoute()
const quizStore = useQuizStore()

const bookId = computed(() => route.params.id as string)
const book = computed(() => quizStore.currentBook)

onMounted(() => {
  if (bookId.value) {
    quizStore.setBook(bookId.value)
  }
})

function goBack() {
  router.push('/')
}

function startQuiz(chapterId: string) {
  router.push(`/quiz/${bookId.value}/${chapterId}`)
}
</script>
