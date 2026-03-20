<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">📚 读书刷题</h1>
            <p class="mt-2 text-gray-600">通过刷题巩固知识，提升编程技能</p>
          </div>
          <div class="text-sm text-gray-500">
            共 {{ books.length }} 本书籍
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Books Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="book in books"
          :key="book.id"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
          @click="goToBook(book.id)"
        >
          <!-- Book Cover -->
          <div class="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div class="text-white text-center p-4">
              <div class="text-6xl mb-2">📖</div>
              <div class="text-lg font-semibold">{{ book.title }}</div>
            </div>
          </div>

          <!-- Book Info -->
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ book.title }}</h3>
            <p class="text-sm text-gray-500 mb-3">作者：{{ book.author }}</p>
            <p class="text-gray-600 text-sm line-clamp-3 mb-4">{{ book.description }}</p>

            <!-- Chapter Count -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">
                {{ book.chapters.length }} 个章节
              </span>
              <button
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                开始学习
                <svg class="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="books.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📚</div>
        <h3 class="text-lg font-medium text-gray-900">暂无书籍</h3>
        <p class="text-gray-500">请添加一些书籍开始学习</p>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p class="text-center text-gray-500 text-sm">
          读书刷题 - 让学习更高效
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'

const router = useRouter()
const quizStore = useQuizStore()

const books = computed(() => quizStore.allBooks)

function goToBook(bookId: string) {
  router.push(`/book/${bookId}`)
}
</script>
