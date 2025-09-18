<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useVirtualList } from '../tools/virtual'

// 定义列表项数据结构
interface ListItem {
  id: number
  title: string
  description: string
  height: number // 存储项目高度
}

// 配置项
const ITEM_HEIGHT = 80 // 默认列表项高度

// 响应式数据
const listContainer = ref<HTMLDivElement | null>(null)
const items = ref<ListItem[]>([])

// 使用 VueUse 测量容器高度
const { height: containerHeight } = useElementSize(listContainer)

const itemSize = (index: number) => items.value[index]?.height || ITEM_HEIGHT

// 使用自定义虚拟列表
const virtualList = useVirtualList({
  itemSize, // 使用动态项目高度
  length: computed(() => items.value.length),
  windowSize: computed(() => containerHeight.value || 500), // 使用动态容器高度
})

// 初始化数据
function initItems(count: number) {
  items.value = Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `列表项 #${index + 1}`,
    description: `这是第 ${index + 1} 个列表项的详细描述信息。虚拟列表可以高效渲染大量数据。`,
    height: Math.floor(Math.random() * 60) + 60, // 随机高度：60-120px
  }))
}

// 设置项目数量
function setItemCount(count: number) {
  initItems(count)
}

// 处理鼠标滚轮事件
function handleWheel(event: WheelEvent) {
  event.preventDefault()

  const delta = event.deltaY
  virtualList.windowStart += delta
}

// 初始化数据
initItems(10000)
</script>

<template>
  <div class="p-6 w-full h-screen flex flex-col">
    <!-- 控制面板 -->
    <div class="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700 mb-4">
      <div class="flex gap-2">
        <button
          v-for="count in [1000, 10000, 100000]"
          :key="count"
          class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded text-sm transition-colors"
          @click="setItemCount(count)"
        >
          {{ count.toLocaleString() }}
        </button>
      </div>

      <div class="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-700">
        <div class="flex gap-4 text-xs">
          <div class="text-neutral-500 dark:text-neutral-400">
            <span class="font-medium">项目:</span> {{ ITEM_HEIGHT }}px
          </div>
          <div class="text-neutral-500 dark:text-neutral-400">
            <span class="font-medium">窗口:</span> {{ Math.round(containerHeight) }}px
          </div>
        </div>
      </div>
    </div>

    <!-- 虚拟列表容器 -->
    <div class="flex-1 bg-white dark:bg-neutral-800 rounded shadow border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <div
        ref="listContainer"
        class="relative w-full h-full overflow-hidden"
        @wheel="handleWheel"
      >
        <!-- 可视区域内容 -->
        <div
          class="absolute top-0 left-0 right-0 w-full"
          :style="{ top: `-${virtualList.windowStart}px`, height: `${virtualList.contentHeight}px` }"
        >
          <div
            v-for="item in virtualList.items"
            :key="item"
            class="flex absolute items-center p-3 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0 group hover:bg-neutral-100 dark:hover:bg-neutral-700 w-full"
            :style="{ height: `${itemSize(item)}px`, top: `${virtualList.itemStart(item)}px` }"
          >
            <!-- 序号徽章 -->
            <div class="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-emerald-600 text-white rounded-full text-xs font-medium mr-3">
              {{ items[item]?.id }}
            </div>

            <!-- 内容区域 -->
            <div class="flex-1 min-w-0">
              <div class="font-medium text-neutral-900 dark:text-neutral-100 mb-0.5 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                {{ items[item]?.title }}
              </div>
              <div class="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {{ items[item]?.description }}
              </div>
            </div>
          </div>
        </div>

        <!-- 滚动指示器 -->
        <div class="absolute bottom-3 right-3 bg-black/80 dark:bg-white/90 text-white dark:text-neutral-900 px-2 py-1 rounded text-xs font-medium">
          {{ Math.round(virtualList.windowStart) }} / {{ Math.round(virtualList.contentHeight - containerHeight) }}
        </div>

        <!-- 滚动提示 -->
        <div v-if="items.length > 0 && virtualList.windowStart === 0" class="absolute bottom-3 left-3 bg-black/80 dark:bg-white/90 text-white dark:text-neutral-900 px-2 py-1 rounded text-xs font-medium animate-pulse">
          🖱️ 滚轮滚动
        </div>
      </div>
    </div>
  </div>
</template>
