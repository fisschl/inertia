<script setup lang="ts">
import { Move } from 'lucide-vue-next'

const examples = [
  {
    name: 'PixiJS 拖拽示例',
    description: '使用 PixiJS 和 GSAP 实现的拖拽功能，带有惯性动画效果',
    path: '/pixi-drag',
    icon: Move,
  },
]
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <RouterLink
          v-for="example in examples"
          :key="example.name"
          :to="example.path"
          class="example-link"
        >
          <div class="example-header">
            <component :is="example.icon" class="example-icon" />
            <span class="example-name">
              {{ example.name }}
            </span>
          </div>
          <p class="example-description">
            {{ example.description }}
          </p>
        </RouterLink>
      </nav>
    </aside>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  background: #f5f5f5;
}

.sidebar {
  width: 280px;
  height: 100vh;
  background: #1e1e1e;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #333;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
}

.example-link {
  display: block;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  text-decoration: none;
  color: inherit;
}

.example-link:hover {
  background: #252525;
  border-left-color: #007acc;
}

.example-link.router-link-active {
  background: #252525;
  border-left-color: #007acc;
}

.example-header {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.example-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  flex-shrink: 0;
}

.example-name {
  font-size: 14px;
  font-weight: 500;
}

.example-description {
  font-size: 12px;
  color: #888;
  line-height: 1.4;
}

.main-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}
</style>
