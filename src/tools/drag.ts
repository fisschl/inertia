import type { Container, FederatedPointerEvent } from 'pixi.js'
import { gsap } from 'gsap'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { PixiPlugin } from 'gsap/PixiPlugin'

/**
 * 拖拽配置选项
 */
export interface DraggableOptions {
  /** 要拖拽的PIXI容器元素 */
  container: Container
  /** X轴拖拽范围，格式为[最小值, 最大值] */
  xRange?: [number, number]
  /** Y轴拖拽范围，格式为[最小值, 最大值] */
  yRange?: [number, number]
}

export function createDraggable(options: DraggableOptions) {
  // 注册GSAP插件
  gsap.registerPlugin(InertiaPlugin, PixiPlugin)

  const TRACK_PROPS = 'x,y'

  const draggable = {
    ...options,
    handlePointerDown(event: FederatedPointerEvent) {
      const { container } = draggable

      // 启用元素的惯性跟踪
      InertiaPlugin.track(container, TRACK_PROPS)

      const state = {
        pointerX: event.clientX,
        pointerY: event.clientY,
        eleX: container.x,
        eleY: container.y,
      }

      // 创建快速移动动画函数
      const xTo = gsap.quickTo(container, 'x', { duration: 0.1, ease: 'power4' })
      const yTo = gsap.quickTo(container, 'y', { duration: 0.1, ease: 'power4' })

      /**
       * 处理指针移动事件
       */
      const handlePointerMove = (event: PointerEvent) => {
      // 计算相对位移并应用到元素位置
        xTo(state.eleX + (event.clientX - state.pointerX))
        yTo(state.eleY + (event.clientY - state.pointerY))
      }

      /**
       * 处理指针释放事件
       */
      const handlePointerUp = () => {
        document.removeEventListener('pointermove', handlePointerMove)
        document.removeEventListener('pointerup', handlePointerUp)

        // 解构获取边界范围
        const [minX, maxX] = options.xRange ?? []
        const [minY, maxY] = options.yRange ?? []

        // 应用惯性动画效果
        gsap.to(container, {
          inertia: {
            duration: 0.35,
            x: {
              velocity: 'auto',
              min: minX,
              max: maxX,
            },
            y: {
              velocity: 'auto',
              min: minY,
              max: maxY,
            },
          },
        })
      }

      // 注册事件监听器
      document.addEventListener('pointermove', handlePointerMove)
      document.addEventListener('pointerup', handlePointerUp)
    },
    destroy() {
      const { container } = draggable
      InertiaPlugin.untrack(container, TRACK_PROPS)
      container.off('pointerdown', draggable.handlePointerDown)
    },
  }
  const { container } = draggable
  container.on('pointerdown', draggable.handlePointerDown)
  return draggable
}

export type DraggableInstance = ReturnType<typeof createDraggable>
