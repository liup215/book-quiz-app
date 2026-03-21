# 技术规格

## 技术栈概述

### 前端框架
- **Vue 3**: 使用 Composition API，提供更好的逻辑复用和类型支持
- **Vite**: 快速的开发服务器和构建工具
- **TypeScript**: 静态类型检查，提高代码质量和可维护性

### 状态管理
- **Pinia**: Vue 官方推荐的状态管理方案
  - 支持 TypeScript
  - 模块化 store 设计
  - 用于管理测验状态、用户答案、进度等

### 路由
- **Vue Router 4**: 单页应用路由管理
  - 章节列表页面
  - 测验页面
  - 结果页面

### 样式
- **Tailwind CSS**: 实用优先的 CSS 框架
  - 快速构建响应式界面
  - 自定义主题配置
  - 暗色/亮色模式支持

### 部署
- **GitHub Pages**: 静态网站托管
  - 自动化部署通过 GitHub Actions
  - 免费、稳定、易于维护

### 题目生成
- **AI 模型**: Qwen / Claude
  - 分析章节内容
  - 生成高质量测验题目
  - 提供答案解析

## 项目结构

```
book-quiz-app/
├── src/
│   ├── components/        # 可复用组件
│   │   ├── QuizQuestion.vue
│   │   ├── QuizOptions.vue
│   │   └── ProgressBar.vue
│   ├── views/             # 页面视图
│   │   ├── HomeView.vue
│   │   ├── ChapterView.vue
│   │   ├── QuizView.vue
│   │   └── ResultView.vue
│   ├── stores/            # Pinia stores
│   │   ├── quiz.ts
│   │   └── progress.ts
│   ├── data/              # 静态数据
│   │   └── chapters.json
│   ├── types/             # TypeScript 类型定义
│   │   └── index.ts
│   ├── router/            # 路由配置
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── books/                 # 书籍章节内容
├── scripts/               # 题目生成脚本
├── public/                # 静态资源
└── dist/                  # 构建输出
```

## 数据格式

### 章节数据结构
```typescript
interface Chapter {
  id: string;
  title: string;
  content: string;
  summary?: string;
}
```

### 测验题目数据结构
```typescript
interface QuizQuestion {
  id: string;
  chapterId: string;
  type: 'single' | 'multiple' | 'boolean';
  question: string;
  options: string[];
  correctAnswer: number | number[];
  explanation: string;
}
```

## 开发规范

- 使用 ESLint + Prettier 进行代码格式化
- 组件使用 PascalCase 命名
- 文件使用 kebab-case 命名
- 类型定义优先使用 interface
