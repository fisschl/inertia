<script setup lang="ts">
import { usePreferredDark } from '@vueuse/core'
import AppLayout from '@/components/AppLayout.vue'

const isDark = usePreferredDark()

watchEffect(() => {
  const { classList } = document.documentElement
  if (isDark.value)
    classList.add('dark')
  else classList.remove('dark')
})
</script>

<template>
  <AppLayout />
</template>

<style>
#app {
  height: 100vh;
  overflow: hidden;
}

html {
  color-scheme: light dark;
  font-family: var(--font-sans);

  body {
    font-family: inherit;
  }
}
</style>
