import type { MaybeRefOrGetter } from 'vue'
import { computed, reactive, ref, toValue } from 'vue'

export interface VirtualListOptions {
  itemSize: (index: number) => number
  length: MaybeRefOrGetter<number>
  windowSize: MaybeRefOrGetter<number>
}

export function useVirtualList(options: VirtualListOptions) {
  /**
   * 记录每个元素的起始位置
   */
  const cache = computed(() => {
    let top = 0
    const { itemSize } = options
    return Array.from({ length: toValue(options.length) }, (_, i) => {
      const value = top
      top += itemSize(i)
      return value
    })
  })

  /**
   * 窗口起始位置
   */
  const windowStart = ref(0)

  const windowEnd = computed(() => {
    return windowStart.value + toValue(options.windowSize)
  })

  const instance = reactive({
    cache,
    windowStart,
    windowEnd,
    contentHeight: computed(() => {
      const index = toValue(options.length) - 1
      return (cache.value[index] ?? 0) + options.itemSize(index)
    }),
    scrollTo: (start: number) => {
      windowStart.value = start
    },
    items: computed(() => {
      const start = findClosestLessOrEqual({ list: cache.value, target: windowStart.value })
      const end = findClosestLessOrEqual({ list: cache.value, target: windowEnd.value })
      return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }),
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
    // 计算中间索引，使用 Math.floor 确保得到整数索引
    // 避免整数溢出的写法：Math.floor(left + (right - left) / 2)
    const mid = Math.floor((left + right) / 2)

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
