<script setup lang="ts">
import { useEventListener, useScroll, useWindowSize } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

// 定义列表项数据结构
interface ListItem {
  id: number
  title: string
  description: string
}

// 配置项
const ITEM_HEIGHT = 80 // 每个列表项的高度
const BUFFER_SIZE = 5 // 缓冲区大小，额外渲染的项目数量

// 响应式数据
const listContainer = ref<HTMLDivElement | null>(null)
const items = ref<ListItem[]>([])
const containerHeight = ref(500) // 容器高度
const scrollTop = ref(0)

// 使用 VueUse hooks
const { height } = useWindowSize()
const scrollData = useScroll(listContainer)

// 监听滚动数据变化，更新scrollTop
watch(() => scrollData.y.value, (newValue) => {
  scrollTop.value = newValue
})

// 初始化数据
function initItems(count: number) {
  items.value = Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `列表项 #${index + 1}`,
    description: `这是第 ${index + 1} 个列表项的详细描述信息。虚拟列表可以高效渲染大量数据。`,
  }))
}

// 设置项目数量
function setItemCount(count: number) {
  initItems(count)
  // 重置滚动位置
  if (listContainer.value) {
    listContainer.value.scrollTop = 0
    scrollTop.value = 0
  }
}

// 计算总高度
const totalHeight = computed(() => items.value.length * ITEM_HEIGHT)

// 计算可见项的起始索引
const startIndex = computed(() => {
  const index = Math.floor(scrollTop.value / ITEM_HEIGHT) - BUFFER_SIZE
  return Math.max(0, index)
})

// 计算可见项的结束索引
const endIndex = computed(() => {
  const visibleCount = Math.ceil(containerHeight.value / ITEM_HEIGHT)
  const index = startIndex.value + visibleCount + BUFFER_SIZE * 2
  return Math.min(items.value.length, index)
})

// 计算偏移量
const offsetY = computed(() => startIndex.value * ITEM_HEIGHT)

// 计算可见项列表
const visibleItems = computed(() => {
  return items.value.slice(startIndex.value, endIndex.value)
})

// 设置容器高度
function setContainerHeight(height: number) {
  if (listContainer.value) {
    listContainer.value.style.height = `${height}px`
  }
}

// 监听窗口大小变化，调整容器高度
function handleResize() {
  // 保持容器高度为视口高度的60%
  const newHeight = height.value * 0.6
  const clampedHeight = Math.max(400, Math.min(800, newHeight))
  containerHeight.value = clampedHeight
  setContainerHeight(clampedHeight)
}

// 使用 VueUse 的 useEventListener 替代手动的事件监听
useEventListener('resize', handleResize)

// 初始化数据
initItems(10000)
handleResize()
</script>

<template>
  <div class="p-5 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">
      虚拟列表示例
    </h1>

    <div class="flex items-center mb-4">
      <button class="px-4 py-2 bg-emerald-500 text-white rounded-md cursor-pointer hover:bg-emerald-600 transition-colors mr-2" @click="setItemCount(1000)">
        1000 条数据
      </button>
      <button class="px-4 py-2 bg-emerald-500 text-white rounded-md cursor-pointer hover:bg-emerald-600 transition-colors mr-2" @click="setItemCount(10000)">
        10000 条数据
      </button>
      <button class="px-4 py-2 bg-emerald-500 text-white rounded-md cursor-pointer hover:bg-emerald-600 transition-colors" @click="setItemCount(100000)">
        100000 条数据
      </button>
      <span class="ml-4 text-gray-500">当前渲染: {{ visibleItems.length }} / {{ items.length }} 项</span>
    </div>

    <div
      ref="listContainer"
      class="relative w-full overflow-y-auto border border-gray-200 rounded-md bg-white"
    >
      <!-- 占位元素，保持滚动条高度 -->
      <div
        class="absolute top-0 left-0 right-0"
        :style="{ height: `${totalHeight}px` }"
      />

      <!-- 可视区域内容 -->
      <div
        class="absolute top-0 left-0 right-0 w-full"
        :style="{ transform: `translateY(${offsetY}px)` }"
      >
        <div
          v-for="item in visibleItems"
          :key="item.id"
          class="flex items-center h-20 p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          :class="{ 'bg-gray-50': item.id % 2 === 0 }"
        >
          <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-emerald-500 text-white rounded-full font-bold mr-4">
            {{ item.id }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-bold mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {{ item.title }}
            </div>
            <div class="text-gray-500 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              {{ item.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
