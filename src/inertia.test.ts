import { describe, expect, it } from 'bun:test'
import { Inertia } from './inertia'

describe('Inertia', () => {
  it('应使用正确的初始位置和摩擦力初始化', () => {
    const inertia = new Inertia([1, 2, 3], 0.8)
    expect(inertia.position).toEqual([1, 2, 3])
    expect(inertia.frictionCoefficient).toBe(0.8)
    expect(inertia.dimensions).toBe(3)
  })

  it('对于无效的摩擦力值应抛出错误', () => {
    expect(() => new Inertia([0, 0], 1.5)).toThrow('摩擦系数必须在0到1之间')
    expect(() => new Inertia([0, 0], -0.1)).toThrow('摩擦系数必须在0到1之间')
  })

  it('应根据速度更新位置', () => {
    const inertia = new Inertia([0, 0], 0.9)
    inertia.setVelocity([10, 5])

    inertia.update(1) // 1秒

    // 位置应按速度 * 时间改变
    expect(inertia.position[0]).toBeCloseTo(10)
    expect(inertia.position[1]).toBeCloseTo(5)
  })

  it('应应用摩擦力随时间减小速度', () => {
    const inertia = new Inertia([0, 0], 0.8)
    inertia.setVelocity([10, 5])

    inertia.update(1) // 1秒

    // 速度应按摩擦系数减小
    expect(inertia.velocity[0]).toBeCloseTo(8) // 10 * 0.8
    expect(inertia.velocity[1]).toBeCloseTo(4) // 5 * 0.8
  })

  it('应正确处理1D情况', () => {
    const inertia = new Inertia([5], 0.9)
    inertia.setVelocity([3])

    expect(inertia.dimensions).toBe(1)
    expect(inertia.position).toEqual([5])
    expect(inertia.velocity).toEqual([3])

    inertia.update(1)
    expect(inertia.position[0]).toBeCloseTo(8) // 5 + 3
    expect(inertia.velocity[0]).toBeCloseTo(2.7) // 3 * 0.9
  })

  it('应正确处理3D情况', () => {
    const inertia = new Inertia([1, 2, 3], 0.9)
    inertia.setVelocity([10, 0, 5])

    expect(inertia.dimensions).toBe(3)

    inertia.update(1)
    expect(inertia.position[0]).toBeCloseTo(11) // 1 + 10
    expect(inertia.position[1]).toBeCloseTo(2) // 2 + 0
    expect(inertia.position[2]).toBeCloseTo(8) // 3 + 5

    expect(inertia.velocity[0]).toBeCloseTo(9) // 10 * 0.9
    expect(inertia.velocity[1]).toBeCloseTo(0) // 0 * 0.9
    expect(inertia.velocity[2]).toBeCloseTo(4.5) // 5 * 0.9
  })

  it('应正确应用冲量', () => {
    const inertia = new Inertia([0, 0], 0.9)
    inertia.applyImpulse([5, 3])

    expect(inertia.velocity[0]).toBeCloseTo(5)
    expect(inertia.velocity[1]).toBeCloseTo(3)
  })

  it('应检测何时静止', () => {
    const inertia = new Inertia([0, 0], 0.9)
    expect(inertia.isAtRest()).toBe(true)

    inertia.setVelocity([1, 0])
    expect(inertia.isAtRest()).toBe(false)

    // 应用足够的摩擦力使其停止 - 使用更高的摩擦系数以加快测试
    const testInertia = new Inertia([0, 0], 0.5)
    testInertia.setVelocity([1, 0])
    expect(testInertia.isAtRest()).toBe(false)

    for (let i = 0; i < 50; i++) {
      testInertia.update(1)
      if (testInertia.isAtRest())
        break
    }
    expect(testInertia.isAtRest()).toBe(true)
  })

  it('应正确计算速度', () => {
    const inertia = new Inertia([0, 0], 0.9)
    inertia.setVelocity([3, 4])

    // 速度应为 sqrt(3^2 + 4^2) = sqrt(25) = 5
    expect(inertia.speed).toBeCloseTo(5)
  })

  it('对于不匹配的维度应抛出错误', () => {
    const inertia = new Inertia([0, 0], 0.9)

    expect(() => inertia.setVelocity([1, 2, 3])).toThrow('速度维度必须与位置/速度维度匹配')
    expect(() => inertia.applyImpulse([1])).toThrow('冲量维度必须与位置/速度维度匹配')
  })
})
