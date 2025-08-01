# AI Chatbot

一个基于 React 和 AI SDK 构建的现代化 AI 聊天机器人应用。

## 功能特性

- 🤖 智能对话：支持与 AI 模型进行自然语言对话
- 🎨 现代化 UI：使用 shadcn/ui 组件库构建的美观界面
- 📱 响应式设计：适配各种屏幕尺寸

## 技术栈

- **前端框架**: React 18
- **开发语言**: TypeScript
- **构建工具**: Vite
- **UI 组件**: shadcn/ui + Radix UI
- **样式框架**: Tailwind CSS
- **AI SDK**: Vercel AI SDK
- **状态管理**: TanStack Query
- **路由**: react-router-dom

## 快速开始

### 安装依赖

```bash
git clone https://github.com/enzeberg/ai-chatbot.git

cd ai-chatbot

npm install
```

### 开发环境

```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用。

### 构建部署

```bash
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

```
src/
├── components/          # React 组件
│   ├── ApiKeyDialog.tsx # API 密钥配置对话框
│   └── ChatInterface.tsx # 聊天界面组件
├── main.tsx            # 应用入口
└── ...
```
