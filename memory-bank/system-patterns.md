# 系统架构模式

## 前端架构模式

### 单页应用 (SPA)

采用 Vue 3 单页应用架构，所有页面在客户端动态渲染，无需服务端参与。

**优势：**
- 流畅的用户体验
- 减少服务器负载
- 易于部署到静态托管

## 数据流

### 静态 JSON 数据 → 前端展示

```
books/
├── atomic-habits/
│   ├── chapters.json      # 章节内容
│   └── quizzes.json       # 测验题目
└── ...

    ↓ (构建时/运行时加载)

src/stores/
├── quiz.ts                # 测验状态管理
└── progress.ts            # 学习进度管理

    ↓ (组件消费)

src/views/
├── ChapterView.vue        # 章节展示
├── QuizView.vue           # 测验页面
└── ResultView.vue         # 结果页面
```

**特点：**
- 数据存储在静态 JSON 文件中
- Pinia Store 管理应用状态
- 组件通过 Store 获取数据

## 模块划分

### 章节模块 (Chapter Module)

**职责：**
- 章节列表展示
- 章节内容展示
- 章节导航

**组件：**
- `ChapterList.vue` - 章节列表
- `ChapterCard.vue` - 章节卡片
- `ChapterContent.vue` - 章节内容展示

**Store：**
- `chapterStore` - 章节数据管理

### 测验模块 (Quiz Module)

**职责：**
- 题目展示
- 用户作答
- 答案提交
- 实时反馈

**组件：**
- `QuizQuestion.vue` - 题目展示
- `QuizOptions.vue` - 选项组件
- `QuizProgress.vue` - 进度条
- `QuizNavigation.vue` - 题目导航

**Store：**
- `quizStore` - 测验状态管理

### 结果模块 (Result Module)

**职责：**
- 成绩统计
- 答案解析展示
- 错题回顾
- 学习建议

**组件：**
- `ResultSummary.vue` - 成绩总结
- `ResultDetail.vue` - 详细解析
- `ResultReview.vue` - 错题回顾

**Store：**
- `progressStore` - 学习进度追踪

## 状态管理模式

### Pinia Store 设计

```typescript
// quiz.ts
export const useQuizStore = defineStore('quiz', {
  state: () => ({
    currentChapter: null as Chapter | null,
    questions: [] as QuizQuestion[],
    currentQuestionIndex: 0,
    answers: {} as Record<string, number | number[]>,
    isCompleted: false,
    score: 0
  }),
  
  getters: {
    currentQuestion: (state) => state.questions[state.currentQuestionIndex],
    progress: (state) => ({
      current: state.currentQuestionIndex + 1,
      total: state.questions.length
    })
  },
  
  actions: {
    loadQuestions(chapterId: string) { /* ... */ },
    answerQuestion(questionId: string, answer: number | number[]) { /* ... */ },
    submitQuiz() { /* ... */ },
    resetQuiz() { /* ... */ }
  }
})
```

## 路由设计

```typescript
const routes = [
  { path: '/', component: HomeView },
  { path: '/chapters', component: ChapterListView },
  { path: '/chapters/:id', component: ChapterView },
  { path: '/quiz/:chapterId', component: QuizView },
  { path: '/result/:chapterId', component: ResultView }
]
```

## 组件通信模式

1. **Props Down**: 父组件通过 props 传递数据给子组件
2. **Events Up**: 子组件通过 emit 触发事件通知父组件
3. **Store Sharing**: 跨组件共享状态使用 Pinia Store

## 样式模式

### Tailwind CSS 实用类优先

- 使用 Tailwind 的实用类进行样式编写
- 自定义配置扩展主题颜色
- 响应式设计使用 Tailwind 断点

### 组件样式规范

```vue
<template>
  <div class="quiz-container p-4 md:p-6 lg:p-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
      {{ title }}
    </h1>
  </div>
</template>
```
