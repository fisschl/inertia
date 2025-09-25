<script setup lang="ts">
// 字重列表，以50为分界，从100到900
const fontWeights = [100, 200, 300, 350, 400, 500, 600, 650, 700, 800, 900]

// 测试文本（中英文混合，中文在开头）
const sampleText = '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。 The quick brown fox jumps over the lazy dog. 0123456789'
</script>

<template>
  <div class="p-4 h-full overflow-auto">
    <table class="w-full border-collapse border border-gray-300 dark:border-gray-600 text-lg">
      <thead class="text-base">
        <tr class="bg-gray-100 dark:bg-gray-700">
          <th class="border border-gray-300 dark:border-gray-600 p-2 text-left font-normal whitespace-nowrap">
            字重
          </th>
          <th class="border border-gray-300 dark:border-gray-600 p-2 text-left font-normal whitespace-nowrap">
            MiSans
          </th>
          <th class="border border-gray-300 dark:border-gray-600 p-2 text-left font-normal whitespace-nowrap">
            system-ui
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="weight in fontWeights"
          :key="weight"
        >
          <td class="border border-gray-300 dark:border-gray-600 p-2 font-medium">
            {{ weight }}
          </td>
          <td class="border border-gray-300 dark:border-gray-600 p-2" :style="{ fontFamily: 'MiSans, sans-serif', fontWeight: weight }">
            {{ sampleText }}
          </td>
          <td class="border border-gray-300 dark:border-gray-600 p-2" :style="{ fontFamily: 'system-ui, sans-serif', fontWeight: weight }">
            {{ sampleText }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
