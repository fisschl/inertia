<script setup lang="ts">
import { Application, Container, Graphics, Text } from 'pixi.js'
import { onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from 'vue'
import { useDraggable } from '@/tools/drag'

const resizeTo = useTemplateRef('canvas-container')

const app = shallowRef<Application>()

onMounted(async () => {
  if (!resizeTo.value)
    return

  // 创建一个新的应用程序
  app.value = new Application()

  // 初始化应用程序
  await app.value.init({
    resizeTo: resizeTo.value,
    preference: 'webgpu',
    hello: true,
    resolution: devicePixelRatio,
    autoDensity: true,
  })

  const { stage, canvas, screen } = app.value

  canvas.style.userSelect = 'none'
  // 将应用程序画布添加到容器中
  resizeTo.value.appendChild(canvas)

  // 创建一个容器来包含正方形和文字
  const container = new Container()

  // 创建一个正方形图形
  const square = new Graphics()
  square.rect(0, 0, 100, 100)
  square.fill(0x3366FF)

  // 创建说明文字
  const text = new Text({
    text: '请拖拽我',
    style: {
      fontSize: 14,
      fill: 0xFFFFFF,
      align: 'center',
    },
  })

  // 将文字定位在正方形中心
  text.x = (100 - text.width) / 2
  text.y = (100 - text.height) / 2

  // 将正方形和文字添加到容器
  container.addChild(square)
  container.addChild(text)

  // 将容器定位在屏幕中心
  container.x = (screen.width - 100) / 2
  container.y = (screen.height - 100) / 2

  // 将容器添加到舞台
  stage.addChild(container)

  // 使用 createDragger 使容器可拖拽
  useDraggable({
    element: container,
    xRange: [0, screen.width - 100],
    yRange: [0, screen.height - 100],
    enableCursor: true,
  })
})

onBeforeUnmount(() => {
  if (app.value)
    app.value.destroy()
})
</script>

<template>
  <div ref="canvas-container" class="h-full w-full overflow-hidden" />
</template>
