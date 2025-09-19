import type { MaybeRefOrGetter } from 'vue'
import { computed, reactive, ref, toValue } from 'vue'

/**
 * 虚拟列表配置选项接口
 *
 * 该接口定义了创建高性能虚拟列表所需的配置参数，用于优化大量数据的渲染
 */
export interface VirtualListOptions {
  /**
   * 计算指定索引项目高度的函数
   *
   * @param index 项目的索引
   * @returns 项目的高度值
   */
  itemSize: (index: number) => number

  /**
   * 列表的总项目数
   *
   * 可以是普通数值或Vue的响应式引用（ref/computed）
   */
  length: MaybeRefOrGetter<number>

  /**
   * 可视窗口的大小
   */
  windowSize: MaybeRefOrGetter<number>
}

/**
 * 创建一个高性能的虚拟列表工具
 *
 * 虚拟列表是一种优化大量数据渲染的技术，它只渲染可视区域内的项目，而不是全部数据
 * 该函数提供了管理虚拟列表所需的全部状态和方法
 *
 * @param options 虚拟列表配置选项
 * @returns 包含虚拟列表状态和方法的响应式对象
 *
 * @example
 * // 创建一个简单的虚拟列表实例
 * const virtualList = useVirtualList({
 *   itemSize: (index) => 80, // 每个项目高度80px
 *   length: 10000,          // 总共有10000个项目
 *   windowSize: 500         // 可视窗口高度500px
 * });
 *
 * // 滚动到指定位置
 * virtualList.windowStart = 200;
 *
 * // 获取当前可见的项目索引
 * const visibleItemIndices = virtualList.items;
 */
export function useVirtualList(options: VirtualListOptions) {
  /**
   * 记录每个元素的起始位置
   */
  const cache = computed(() => {
    const { itemSize } = options
    const result = Array.from<number>({ length: toValue(options.length) })
    let top = 0
    for (let i = 0; i < result.length; i++) {
      result[i] = top
      top += itemSize(i)
    }
    return result
  })

  /**
   * 窗口起始位置
   */
  const windowStart = ref(0)

  /**
   * 窗口结束位置
   */
  const windowEnd = computed(() => {
    return windowStart.value + toValue(options.windowSize)
  })

  /**
   * 整个列表的总高度
   * 这是一个计算属性，通过最后一个项目的位置和高度计算得出
   */
  const contentHeight = computed(() => {
    const index = toValue(options.length) - 1
    return (cache.value[index] ?? 0) + options.itemSize(index)
  })

  const instance = reactive({
    /**
     * 缓存每个项目的起始位置（顶部偏移量）
     * 这是一个计算属性，当项目数量或项目大小变化时会自动更新
     */
    cache,

    /**
     * 当前可视窗口的起始位置（顶部偏移量）
     * 通过修改此值可以控制列表的滚动位置
     */
    windowStart,

    /**
     * 整个列表的总高度
     * 这是一个计算属性，通过最后一个项目的位置和高度计算得出
     */
    contentHeight,

    /**
     * 当前可视窗口的结束位置（底部偏移量）
     * 这是一个计算属性，由windowStart和windowSize自动计算得出
     */
    windowEnd,

    /**
     * 当前可视窗口中可见的项目信息对象数组
     * 这是一个计算属性，当windowStart或windowSize变化时会自动更新
     * 使用二分查找算法高效确定可见项目范围
     */
    items: computed(() => {
      const start = findClosestLessOrEqual({ list: cache.value, target: windowStart.value })
      const result: number[] = []
      let end = start === -1 ? 0 : start
      const list = cache.value
      const { length } = list
      while (end < length && list[end]! <= windowEnd.value) {
        result.push(end)
        end++
      }
      return result
    }),

    /**
     * 查询索引对应的项目起始位置
     * @param index 项目的索引
     * @returns 项目的起始位置（顶部偏移量）
     */
    itemStart: (index: number) => {
      return cache.value[index] ?? 0
    },
  })

  return instance
}

/**
 * 二分查找选项接口
 */
export interface FindClosestLessOrEqualOptions {
  /** 有序的数字数组（升序排列） */
  list: number[]
  /** 要查找的目标值 */
  target: number
  /** 可选的初始左指针位置，默认值为0 */
  left?: number
}

/**
 * 在有序数组中二分查找小于或等于目标值的最接近元素的索引
 *
 * @param options 配置选项对象
 * @returns 找到的元素索引，如果所有元素都大于目标值或数组为空，则返回 -1
 *
 * @example
 * // 返回 3（因为3是小于4的最接近值的索引）
 * findClosestLessOrEqual({ list: [1, 2, 3, 5, 6], target: 4 });
 *
 * @example
 * // 返回 3（精确匹配）
 * findClosestLessOrEqual({ list: [1, 2, 3, 4, 5], target: 4 });
 *
 * @example
 * // 返回 -1（所有元素都大于目标值）
 * findClosestLessOrEqual({ list: [5, 6, 7], target: 4 });
 *
 * @example
 * // 从索引2开始查找
 * findClosestLessOrEqual({ list: [1, 2, 3, 4, 5, 6], target: 4, left: 2 });
 */
function findClosestLessOrEqual(options: FindClosestLessOrEqualOptions): number {
  // 解构配置对象
  const { list, target } = options

  // 边界条件检查：处理空数组情况
  if (list.length === 0) {
    return -1
  }

  // 初始化二分查找的左右指针，使用传入的初始left值或默认为0
  let left = options.left ?? 0
  let right = list.length - 1

  // 用于存储找到的结果索引，初始值为 -1（表示未找到符合条件的元素）
  let result = -1

  // 二分查找循环
  while (left <= right) {
    // 计算中间索引，避免整数溢出的安全写法
    const mid = Math.floor(left + (right - left) / 2)

    // 获取中间位置的元素值
    const value = list[mid]

    // 安全检查：如果中间位置的值是 undefined 或者索引超出范围，返回 -1
    if (value === undefined || mid < 0 || mid >= list.length) {
      return -1
    }

    // 比较中间元素与目标值的大小关系
    if (value < target) {
      // 情况1：中间元素小于目标值
      // 更新结果为当前中间索引（因为它可能是一个候选结果）
      // 然后向右继续查找是否有更接近目标值的元素
      result = mid
      left = mid + 1
      continue
    }

    if (value > target) {
      // 情况2：中间元素大于目标值
      // 向左继续查找更小的元素
      right = mid - 1
      continue
    }

    if (value === target) {
      // 情况3：找到精确匹配
      // 直接返回当前中间索引
      return mid
    }

    // 理论上不会到达这里，但作为防御性编程添加
    throw new Error('二分查找逻辑错误：未处理的情况')
  }

  // 返回最终找到的结果索引（可能为 -1，表示所有元素都大于目标值）
  return result
}

/**
 * 生成一个左闭右开的连续数字数组
 *
 * @param start 起始值（包含）
 * @param end 结束值（不包含）
 * @returns 生成的连续数字数组
 *
 * @example
 * // 返回 [0, 1, 2, 3, 4]
 * range(0, 5)
 *
 * @example
 * // 返回 [5, 6, 7, 8, 9]
 * range(5, 10)
 *
 * @example
 * // 返回 []
 * range(5, 5)
 */
export function range(start: number, end: number): number[] {
  if (start >= end) {
    return []
  }

  return Array.from({ length: end - start }, (_, i) => start + i)
}
