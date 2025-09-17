/**
 * 表示在n维空间中具有惯性的物体的类。
 * 物体的位置随时间根据其速度变化，摩擦力逐渐减小速度直到停止。
 */
export class Inertia {
  /**
   * 物体的位置向量
   * 每个元素代表对应维度的坐标值
   * @default []
   */
  position: number[] = []

  /**
   * 物体的速度向量（单位：像素/毫秒）
   * 每个元素代表对应维度的速度分量
   * @default []
   */
  velocity: number[] = []

  /**
   * 摩擦系数
   * - 范围：0-1
   * - 1 表示无摩擦（速度保持不变）
   * - 0 表示立即停止（速度立即降为0）
   * - 值越小，摩擦力越大，物体停止越快
   */
  friction: number

  /**
   * 上一次更新的时间戳（单位：毫秒）
   * 用于计算时间差，确保物理模拟的准确性
   * @default 0
   */
  time: number = 0

  /**
   * 创建一个新的Inertia对象。
   *
   * @param friction - 摩擦系数（0-1，其中1表示无摩擦，0表示立即停止）
   * @throws {Error} 当摩擦系数不在有效范围内时抛出错误
   */
  constructor(friction: number) {
    if (friction < 0 || friction > 1)
      throw new Error('摩擦系数必须在0到1之间')
    this.friction = friction
    this.time = Date.now()
  }

  /**
   * 设置物体的位置，同时将速度置为0。
   * 此方法会重置物体的运动状态，常用于初始化或重置物体位置。
   *
   * @param position - 物体的位置向量，每个元素代表对应维度的坐标
   */
  setPosition(position: number[]) {
    this.position = Array.from(position)
    this.time = Date.now()
    const dimension = position.length
    this.velocity = Array.from({ length: dimension }).map(() => 0)
    return this
  }

  /**
   * 物体移动到目标位置。根据上一时刻的位置计算出速度，并将物体的位置更新为目标位置。
   * 此方法会计算从当前位置到目标位置所需的瞬时速度。
   *
   * @param target - 目标位置的向量，必须与当前位置维度相同
   *
   * @remarks
   * 此方法假设瞬时移动，计算出的速度为：`(target - position) / deltaTime`
   */
  move(target: number[]) {
    const deltaTime = (Date.now() - this.time)
    const dimension = target.length
    // 计算瞬时速度：(target - position) / deltaTime
    for (let i = 0; i < dimension; i++)
      this.velocity[i] = ((target[i] ?? 0) - (this.position[i] ?? 0)) / deltaTime
    this.position = Array.from(target)
    this.time = Date.now()
    return this
  }

  /**
   * 根据当前速度更新位置并应用摩擦力。
   * 此方法会执行一个物理时间步，包括：
   * 1. 应用摩擦力衰减速度
   * 2. 根据衰减后的速度更新位置
   * 3. 更新时间戳
   *
   * @remarks
   * 摩擦力通过乘法衰减速度：`velocity = velocity * friction`
   * 这会产生自然的指数衰减效果，模拟真实世界的摩擦现象。
   * 时间差由系统自动计算，确保不同帧率下的物理一致性。
   */
  slide() {
    const dimension = this.position.length
    const deltaTime = (Date.now() - this.time)

    // 应用摩擦力：速度按摩擦系数衰减
    for (let i = 0; i < dimension; i++)
      this.velocity[i] = (this.velocity[i] ?? 0) * this.friction

    // 根据衰减后的速度更新位置
    for (let i = 0; i < dimension; i++)
      this.position[i] = (this.position[i] ?? 0) + (this.velocity[i] ?? 0) * deltaTime

    // 更新时间戳
    this.time = Date.now()
    return this
  }
}
