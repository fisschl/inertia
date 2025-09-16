# Inertia

一个用于在n维空间中模拟惯性与摩擦力的TypeScript库。

## 功能特性

- 支持任意维度（1D, 2D, 3D等）
- 位置和速度跟踪
- 摩擦力模拟
- 冲量应用
- 静止检测

## 安装

```bash
npm install inertia
```

## 使用方法

### 基本示例

```typescript
import { Inertia } from 'inertia'

// 在位置(0, 0)创建一个2D物体，摩擦系数为0.9
const object = new Inertia([0, 0], 0.9)

// 设置初始速度
object.setVelocity([10, 5])

// 随时间应用更新
object.update(1) // 1秒后更新
console.log(object.position) // [10, 5]
console.log(object.velocity) // [9, 4.5] (因摩擦力而减小)

// 应用冲量
object.applyImpulse([2, 1])
console.log(object.velocity) // [11, 5.5]

// 检查物体是否静止
if (object.isAtRest()) {
  console.log('物体已停止移动')
}
```

### 1D示例

```typescript
import { Inertia } from 'inertia'

// 创建一个1D物体
const object1D = new Inertia([5], 0.8)
object1D.setVelocity([3])

object1D.update(1)
console.log(object1D.position) // [8]
console.log(object1D.velocity) // [2.4]
```

### 3D示例

```typescript
import { Inertia } from 'inertia'

// 创建一个3D物体
const object3D = new Inertia([0, 0, 0], 0.95)
object3D.applyImpulse([10, 0, 5])

object3D.update(0.5)
console.log(object3D.position) // [5, 0, 2.5]
console.log(object3D.velocity) // [9.75, 0, 4.875]
```

## API

### 构造函数

`new Inertia(initialPosition: number[], friction: number)`

- `initialPosition`: 表示n维空间中初始位置的数字数组
- `friction`: 0到1之间的摩擦系数（0 = 立即停止, 1 = 无摩擦）

### 属性

- `position`: 当前位置，作为数字数组
- `velocity`: 当前速度，作为数字数组
- `frictionCoefficient`: 摩擦系数
- `speed`: 速度向量的大小
- `dimensions`: 维度数量

### 方法

- `update(deltaTime: number)`: 更新位置并为给定时间间隔应用摩擦力
- `applyImpulse(impulse: number[])`: 应用冲量以改变速度
- `setVelocity(velocity: number[])`: 直接设置速度
- `isAtRest()`: 检查物体是否静止（不移动）

## 测试

运行测试：

```bash
bun test
```

## 许可证

MIT
