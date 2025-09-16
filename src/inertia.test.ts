import { describe, expect, it } from 'bun:test'
import { Inertia } from './inertia'

describe('Inertia', () => {
  it('应使用正确的初始位置和摩擦力初始化', () => {
    const inertia = new Inertia([1, 2, 3], 0.8)
    expect(inertia.getPosition()).toEqual([1, 2, 3])
    expect(inertia.getFrictionCoefficient()).toBe(0.8)
    expect(inertia.getDimensions()).toBe(3)
  })

  it('对于无效的摩擦力值应抛出错误', () => {
    expect(() => new Inertia([0, 0], 1.5)).toThrow('摩擦系数必须在0到1之间')
    expect(() => new Inertia([0, 0], -0.1)).toThrow('摩擦系数必须在0到1之间')
  })

  it('应根据速度更新位置', () => {
    const inertia = new Inertia([0, 0], 0.9)
    inertia.setVelocity([10, 5])
    inertia.update(1)
    expect(inertia.getPosition()).toEqual([10, 5])
  })

  it('应应用摩擦力随时间减小速度', () => {
    const inertia = new Inertia([0], 0.8)
    inertia.setVelocity([10])
    inertia.update(1)
    expect(inertia.getVelocity()[0]).toBeCloseTo(8)
  })

  it('应正确处理1D情况', () => {
    const inertia1D = new Inertia([5], 0.9)
    expect(inertia1D.getPosition()).toEqual([5])
    expect(inertia1D.getVelocity()).toEqual([0])
    expect(inertia1D.getDimensions()).toBe(1)

    inertia1D.setVelocity([3])
    expect(inertia1D.getVelocity()).toEqual([3])

    inertia1D.update(1)
    expect(inertia1D.getPosition()).toEqual([8])
  })

  it('应正确处理3D情况', () => {
    const inertia3D = new Inertia([1, 2, 3], 0.8)
    expect(inertia3D.getPosition()).toEqual([1, 2, 3])
    expect(inertia3D.getVelocity()).toEqual([0, 0, 0])
    expect(inertia3D.getDimensions()).toBe(3)

    inertia3D.setVelocity([10, 20, 30])
    expect(inertia3D.getVelocity()).toEqual([10, 20, 30])

    inertia3D.update(0.5)
    expect(inertia3D.getPosition()).toEqual([6, 12, 18])
  })

  it('应正确应用冲量', () => {
    const inertia = new Inertia([0, 0], 0.9)
    inertia.applyImpulse([5, 3])
    expect(inertia.getVelocity()).toEqual([5, 3])
  })

  it('应检测何时静止', () => {
    const inertia = new Inertia([0], 0.5)
    expect(inertia.isAtRest()).toBe(true)

    inertia.setVelocity([0.00000000001])
    expect(inertia.isAtRest()).toBe(true)

    inertia.setVelocity([0.000000001])
    expect(inertia.isAtRest()).toBe(false)
  })

  it('应正确计算速度', () => {
    const inertia = new Inertia([0, 0], 0.9)
    expect(inertia.getSpeed()).toBeCloseTo(0)

    inertia.setVelocity([3, 4])
    expect(inertia.getSpeed()).toBeCloseTo(5) // sqrt(3^2 + 4^2) = 5
  })

  it('对于不匹配的维度应抛出错误', () => {
    const inertia = new Inertia([0, 0], 0.9)

    expect(() => inertia.setVelocity([1, 2, 3])).toThrow('速度维度必须与位置/速度维度匹配')
    expect(() => inertia.applyImpulse([1, 2, 3])).toThrow('冲量维度必须与位置/速度维度匹配')
  })
})
