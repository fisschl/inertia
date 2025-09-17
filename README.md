# Inertia - 带惯性效果的拖拽演示应用

这是一个基于Vue 3、TypeScript、Pixi.js和GSAP的前端应用程序，展示了带有物理惯性效果的拖拽功能。

## 技术栈

- **前端框架**: Vue 3
- **编程语言**: TypeScript
- **构建工具**: Vite
- **样式系统**: Tailwind CSS
- **图形库**: Pixi.js
- **动画库**: GSAP (GreenSock Animation Platform)
- **图标库**: Lucide Vue Next

## 功能特性

- 使用Pixi.js创建高性能图形渲染
- 实现带有物理惯性效果的拖拽交互
- 支持设置拖拽边界范围
- 响应式设计，适配不同屏幕尺寸
- 支持浅色/深色模式
- 现代化UI设计，使用Tailwind CSS

## 项目结构

```
src/
├── App.vue              # 应用入口组件
├── components/
│   └── AppLayout.vue    # 应用布局组件
├── main.ts              # 应用入口文件
├── pages/
│   ├── index.vue        # 首页
│   └── pixi-drag.vue    # Pixi.js拖拽示例
├── style.css            # 全局样式
└── tools/
    └── drag.ts          # 拖拽功能实现
```

## 快速开始

### 安装依赖

```bash
# 使用bun安装依赖
bun install

# 或者使用npm
npm install

# 或者使用yarn
yarn install
```

### 开发模式

```bash
bun run dev
# 或
npm run dev
# 或
yarn dev
```

这将启动开发服务器，通常可以在 http://localhost:5173 访问。

### 构建项目

```bash
bun run build
# 或
npm run build
# 或
yarn build
```

这将在`dist`目录中生成生产版本的应用程序。

### 代码检查

```bash
bun run lint
# 或
npm run lint
# 或
yarn lint
```

## 拖拽功能说明

项目中的拖拽功能主要通过`useDraggable`函数实现，该函数位于`src/tools/drag.ts`文件中。它利用GSAP的InertiaPlugin来实现平滑的惯性效果。

### 主要功能参数

- `element`: 要拖拽的Pixi容器元素
- `xRange`: X轴拖拽范围，格式为[最小值, 最大值]
- `yRange`: Y轴拖拽范围，格式为[最小值, 最大值]
- `enableCursor`: 是否启用抓握手型光标

### 示例用法

```typescript
import { useDraggable } from '@/tools/drag'

// 使容器可拖拽
useDraggable({
  element: container, // Pixi容器
  xRange: [0, screen.width - 100], // X轴边界
  yRange: [0, screen.height - 100], // Y轴边界
  enableCursor: true, // 启用抓握手型光标
})
```

## 页面说明

- **首页**: 应用的入口页面
- **Pixi.js拖拽示例**: 展示了带有惯性效果的正方形拖拽交互

## 样式系统

项目使用Tailwind CSS作为样式系统，支持浅色和深色模式。背景色使用neutral系列，文字颜色使用gray系列，确保良好的可读性和视觉体验。

## 配置说明

- VSCode配置: 已配置Tailwind CSS智能提示支持，包括active-class属性
- ESLint配置: 使用@antfu/eslint-config进行代码风格检查

## 许可证

MIT License
