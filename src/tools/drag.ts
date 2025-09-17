import type { Container, FederatedPointerEvent } from 'pixi.js'
import { gsap } from 'gsap'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { PixiPlugin } from 'gsap/PixiPlugin'

/**
 * 拖拽配置选项
 */
export interface CreateDraggerOptions {
  /** 要拖拽的PIXI容器元素 */
  element: Container
  /** X轴拖拽范围，格式为[最小值, 最大值] */
  xRange?: [number, number]
  /** Y轴拖拽范围，格式为[最小值, 最大值] */
  yRange?: [number, number]
  /** 是否启用抓握手型光标，默认关闭 */
  enableCursor?: boolean
}

/**
 * 创建拖拽功能
 * @param options - 拖拽配置选项
 * @returns 清理函数，用于移除拖拽功能
 */
export function useDraggable(options: CreateDraggerOptions) {
  const { element, enableCursor = false } = options
  element.eventMode = 'static'

  // 根据配置设置光标，默认关闭抓握手型
  if (enableCursor)
    element.cursor = 'grab'

  // 注册GSAP插件
  gsap.registerPlugin(InertiaPlugin, PixiPlugin)
  // 启用元素的惯性跟踪
  InertiaPlugin.track(element, 'x,y')

  /**
   * 处理指针按下事件
   * @param event -  federated pointer事件
   */
  const handlePointerDown = (event: FederatedPointerEvent) => {
    // 如果启用了光标，按下时设置为抓取状态
    if (enableCursor)
      element.cursor = 'grabbing'

    const state = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      eleX: element.x,
      eleY: element.y,
    }

    // 创建快速移动动画函数
    const xTo = gsap.quickTo(element, 'x', { duration: 0.1, ease: 'power4' })
    const yTo = gsap.quickTo(element, 'y', { duration: 0.1, ease: 'power4' })

    /**
     * 处理指针移动事件
     * @param event - 指针事件
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
      // 如果启用了光标，释放时恢复为抓握手型
      if (enableCursor)
        element.cursor = 'grab'
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)

      // 解构获取边界范围
      const [minX, maxX] = options.xRange ?? []
      const [minY, maxY] = options.yRange ?? []

      // 应用惯性动画效果
      gsap.to(element, {
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
  }

  // 注册元素指针按下事件
  element.on('pointerdown', handlePointerDown)

  /**
   * 清理函数 - 移除事件监听并恢复元素状态
   */
  return () => {
    element.off('pointerdown', handlePointerDown)
    // 如果启用了光标，清理时恢复默认光标
    if (enableCursor)
      element.cursor = 'auto'
  }
}
