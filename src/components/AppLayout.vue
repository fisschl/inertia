<script setup lang="ts">
import { List, Move } from 'lucide-vue-next'

const route = useRoute()

const examples = computed(() => {
  return [
    {
      name: 'PixiJS 拖拽示例',
      path: '/pixi-drag',
      icon: markRaw(Move),
      isActive: route.path.startsWith('/pixi-drag'),
    },
    {
      name: 'DOM 虚拟列表示例',
      path: '/virtual-list',
      icon: markRaw(List),
      isActive: route.path.startsWith('/virtual-list'),
    },
  ]
})

const activeExample = computed(() => {
  return examples.value.find(example => example.isActive)
})
</script>

<template>
  <div class="flex h-screen">
    <ElMenu
      :default-active="activeExample?.path"
      :class="$style.aside"
      router
    >
      <ElMenuItem
        v-for="example in examples"
        :key="example.name"
        :index="example.path"
      >
        <ElIcon>
          <component :is="example.icon" />
        </ElIcon>
        <span>
          {{ example.name }}
        </span>
      </ElMenuItem>
    </ElMenu>
    <main class="flex-1 overflow-hidden relative bg-neutral-100 dark:bg-neutral-900 transition-colors duration-200">
      <RouterView />
    </main>
  </div>
</template>

<style module>
.aside {
  width: 220px;
}
</style>
