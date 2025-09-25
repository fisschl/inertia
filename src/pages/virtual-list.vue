<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { useVirtualList } from '../tools/virtual'

// 定义列表项数据结构
interface ListItem {
  id: number
  description: string
}

// 配置项
const ITEM_HEIGHT = 50 // 默认列表项高度

// 响应式数据
const listContainer = useTemplateRef('list-container')
const items = ref<ListItem[]>([])

// 使用 VueUse 测量容器高度
const { height: containerHeight } = useElementSize(listContainer)

const itemSize = () => ITEM_HEIGHT

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
    description: `这是第 ${index + 1} 个列表项的详细描述信息。虚拟列表可以高效渲染大量数据。`,
  }))
}

// 处理鼠标滚轮事件
function handleWheel(event: WheelEvent) {
  event.preventDefault()
  virtualList.scrollBy(event.deltaY)
}

// 初始化数据为10万条
initItems(100000)
</script>

<template>
  <!-- 虚拟列表容器 -->
  <div class="h-screen flex flex-col p-4">
    <div
      ref="list-container"
      class="relative w-full flex-1 overflow-hidden border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800"
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
          :style="{ height: `${itemSize()}px`, top: `${virtualList.itemStart(item)}px` }"
        >
          <!-- 内容区域 -->
          <p class="truncate">
            {{ items[item]?.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
