/**
 * 表示在n维空间中具有惯性的物体的类。
 * 物体的位置随时间根据其速度变化，
 * 摩擦力逐渐减小速度直到停止。
 */
export class Inertia {
  private _position: number[]
  private _velocity: number[]
  private readonly friction: number
  private static readonly VELOCITY_THRESHOLD = 1e-10

  /**
   * 创建一个新的Inertia对象。
   * @param initialPosition - 初始位置，作为数字数组（n维）
   * @param friction - 摩擦系数（0-1，其中1表示无摩擦，0表示立即停止）
   */
  constructor(initialPosition: number[], friction: number) {
    if (friction < 0 || friction > 1) {
      throw new Error('摩擦系数必须在0到1之间')
    }

    this._position = [...initialPosition]
    this._velocity = Array.from({ length: initialPosition.length }, () => 0)
    this.friction = friction
  }

  /**
   * 获取当前位置。
   */
  get position(): number[] {
    return [...this._position]
  }

  /**
   * 获取当前速度。
   */
  get velocity(): number[] {
    return [...this._velocity]
  }

  /**
   * 获取摩擦系数。
   */
  get frictionCoefficient(): number {
    return this.friction
  }

  /**
   * 根据当前速度更新位置并应用摩擦力。
   * @param deltaTime - 自上次更新以来经过的时间（以秒为单位）
   */
  update(deltaTime: number): void {
    // 根据速度更新位置
    for (let i = 0; i < this._position.length; i++) {
      this._position[i] += this._velocity[i] * deltaTime
    }

    // 应用摩擦力减小速度
    for (let i = 0; i < this._velocity.length; i++) {
      this._velocity[i] *= this.friction ** deltaTime

      // 如果速度非常小，则将其设置为零以防止无限滑动
      if (Math.abs(this._velocity[i]) < Inertia.VELOCITY_THRESHOLD) {
        this._velocity[i] = 0
      }
    }
  }

  /**
   * 对物体施加冲量，改变其速度。
   * @param impulse - 要施加的冲量向量
   */
  applyImpulse(impulse: number[]): void {
    if (impulse.length !== this._velocity.length) {
      throw new Error('冲量维度必须与位置/速度维度匹配')
    }

    for (let i = 0; i < this._velocity.length; i++) {
      this._velocity[i] += impulse[i]
    }
  }

  /**
   * 直接设置速度。
   * @param velocity - 新的速度向量
   */
  setVelocity(velocity: number[]): void {
    if (velocity.length !== this._velocity.length) {
      throw new Error('速度维度必须与位置/速度维度匹配')
    }

    this._velocity = [...velocity]
  }

  /**
   * 检查物体是否处于静止状态（不移动）。
   */
  isAtRest(): boolean {
    return this._velocity.every(v => Math.abs(v) < Inertia.VELOCITY_THRESHOLD)
  }

  /**
   * 获取当前速度（速度向量的大小）。
   */
  get speed(): number {
    return Math.sqrt(this._velocity.reduce((sum, v) => sum + v * v, 0))
  }

  /**
   * 获取空间的维度。
   */
  get dimensions(): number {
    return this._position.length
  }
}
