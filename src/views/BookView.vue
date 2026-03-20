<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Book, Chapter } from '@/types'
import booksData from '@/data/books.json'

const route = useRoute()
const router = useRouter()
const book = ref<Book | null>(null)

const bookId = computed((): string => (route.params.id as string) || '')

onMounted(() => {
  const foundBook = booksData.find((b: Book) => b.id === bookId.value)
  if (foundBook) {
    book.value = foundBook as Book
  }
})

function goBack() {
  router.push('/')
}

function startQuiz(chapterId: string) {
  const id = bookId.value
  if (id) {
    router.push(`/quiz/${id}/${chapterId}`)
  }
}

function getChapterIcon(index: number): string {
  const icons: string[] = ['📖', '📚', '📝', '🔍', '💡', '🎯', '🎓', '🏆']
  return icons[index % icons.length] || '📖'
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <button
            @click="goBack"
            class="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span class="font-medium">返回首页</span>
          </button>
          <h1 class="text-xl font-bold text-gray-900 hidden sm:block">书籍详情</h1>
          <div class="w-20"></div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="book" class="space-y-8">
        <!-- Book Info Card -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="md:flex">
            <!-- Book Cover -->
            <div class="md:w-1/3">
              <img
                :src="book.cover"
                :alt="book.title"
                class="w-full h-64 md:h-full object-cover"
              />
            </div>
            
            <!-- Book Details -->
            <div class="p-6 md:w-2/3">
              <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ book.title }}</h1>
              <p class="text-gray-600 mb-4">作者：{{ book.author }}</p>
              <p class="text-gray-700 leading-relaxed mb-6">{{ book.description }}</p>
              
              <!-- Stats -->
              <div class="flex flex-wrap gap-4">
                <div class="flex items-center px-4 py-2 bg-indigo-50 rounded-lg">
                  <svg class="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span class="text-indigo-900 font-medium">{{ book.chapters.length }} 个章节</span>
                </div>
                <div class="flex items-center px-4 py-2 bg-green-50 rounded-lg">
                  <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-green-900 font-medium">
                    {{ book.chapters.reduce((sum, ch) => sum + ch.questionCount, 0) }} 道题目
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chapters Section -->
        <div>
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg class="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            章节列表
          </h2>
          
          <div class="grid gap-4">
            <div
              v-for="(chapter, index) in book.chapters"
              :key="chapter.id"
              class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div class="p-6 flex items-center justify-between">
                <div class="flex items-center flex-1">
                  <span class="text-3xl mr-4">{{ getChapterIcon(index) }}</span>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">{{ chapter.title }}</h3>
                    <p class="text-sm text-gray-500 mt-1">
                      {{ chapter.questionCount }} 道题目
                    </p>
                  </div>
                </div>
                <button
                  @click="startQuiz(chapter.id)"
                  class="ml-4 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  开始答题
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-16">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">书籍未找到</h3>
        <p class="mt-2 text-gray-500">抱歉，您查找的书籍不存在</p>
        <button
          @click="goBack"
          class="mt-6 px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          返回首页
        </button>
      </div>
    </main>
  </div>
</template>
