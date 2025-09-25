<script setup lang="ts">
import { List, Move, Type } from 'lucide-vue-next'

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
    {
      name: '字体对比示例',
      path: '/font-comparison',
      icon: markRaw(Type),
      isActive: route.path.startsWith('/font-comparison'),
    },
  ]
})

const activeExample = computed(() => {
  return examples.value.find(example => example.isActive)
})
</script>

<template>
  <div class="flex h-screen min-h-0">
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
    <main class="flex-1 overflow-hidden relative transition-colors duration-200">
      <RouterView />
    </main>
  </div>
</template>

<style module>
.aside {
  width: 220px;
}
</style>
