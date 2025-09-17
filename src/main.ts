import { gsap } from 'gsap'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { PixiPlugin } from 'gsap/PixiPlugin'
import { Application, Graphics } from 'pixi.js'

gsap.registerPlugin(InertiaPlugin, PixiPlugin)

// 创建一个新的应用程序
const app = new Application()

const containerElement = document.getElementById('app')!

// 初始化应用程序
await app.init({
  resizeTo: containerElement,
  preference: 'webgpu',
})
const { stage, canvas, screen } = app

canvas.style.userSelect = 'none'

// 将应用程序画布添加到文档中
containerElement.appendChild(canvas)

// 创建一个正方形图形
const square = new Graphics()
square.rect(0, 0, 100, 100)
square.fill(0x3366FF)

// 将正方形定位在屏幕中心
square.x = (screen.width - 100) / 2
square.y = (screen.height - 100) / 2

// 使正方形可交互
square.eventMode = 'static'

// 将正方形添加到舞台
stage.addChild(square)

InertiaPlugin.track(square, 'x,y')

// 处理鼠标按下事件
square.on('pointerdown', (event) => {
  const state = {
    pointerX: event.clientX,
    pointerY: event.clientY,
    squareX: square.x,
    squareY: square.y,
  }

  const xTo = gsap.quickTo(square, 'x', { duration: 0.1, ease: 'power4' })
  const yTo = gsap.quickTo(square, 'y', { duration: 0.1, ease: 'power4' })

  const handlePointerMove = (event: PointerEvent) => {
    xTo(state.squareX + (event.clientX - state.pointerX))
    yTo(state.squareY + (event.clientY - state.pointerY))
  }

  const handlePointerUp = () => {
    removeEventListener('pointermove', handlePointerMove)
    removeEventListener('pointerup', handlePointerUp)
    gsap.to(square, {
      inertia: {
        duration: 0.5,
        x: {
          velocity: 'auto',
          min: 0,
          max: screen.width - square.width,
        },
        y: {
          velocity: 'auto',
          min: 0,
          max: screen.height - square.height,
        },
      },
    })
  }

  addEventListener('pointermove', handlePointerMove)
  addEventListener('pointerup', handlePointerUp)
})
