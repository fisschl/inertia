import { Inertia } from '../index'

// 示例1: 带摩擦力的简单2D运动
console.info('=== 2D运动示例 ===')
const ball = new Inertia([0, 0], 0.9) // 从原点开始，摩擦系数为0.9
ball.setVelocity([10, 5]) // 设置初始速度

console.info(`初始位置: [${ball.getPosition().join(', ')}]`)
console.info(`初始速度: [${ball.getVelocity().join(', ')}]`)

// 模拟5秒内的运动
for (let i = 1; i <= 5; i++) {
  ball.update(1) // 每秒更新一次
  console.info(`在t=${i}秒时: 位置=[${ball.getPosition().map(x => x.toFixed(2)).join(', ')}], 速度=[${ball.getVelocity().map(x => x.toFixed(2)).join(', ')}]`)
}

console.info(`最终速度: ${ball.getSpeed().toFixed(2)}`)
console.info(`是否静止: ${ball.isAtRest()}`)
console.info('')

// 示例2: 应用冲量
console.info('=== 冲量示例 ===')
const puck = new Inertia([0], 0.95) // 1D运动
puck.setVelocity([5])

console.info(`初始速度: ${puck.getVelocity()[0].toFixed(2)}`)
console.info('')

// 在t=2s时应用冲量
for (let i = 1; i <= 4; i++) {
  if (i === 2) {
    puck.applyImpulse([3]) // 添加推力
    console.info(`应用冲量! 新速度: ${puck.getVelocity()[0].toFixed(2)}`)
  }
  puck.update(1)
  console.info(`在t=${i}秒时: 位置=${puck.getPosition()[0].toFixed(2)}, 速度=${puck.getVelocity()[0].toFixed(2)}`)
}

// 示例3: 高摩擦力导致快速停止
console.info('=== 高摩擦力示例 ===')
const box = new Inertia([0, 0, 0], 0.7) // 3D高摩擦力
box.setVelocity([10, 0, 5])

console.info(`初始速度: ${box.getSpeed().toFixed(2)}`)

// 更新直到静止
let time = 0
while (!box.isAtRest() && time < 20) {
  box.update(0.5) // 每0.5秒更新一次
  time += 0.5
  if (time % 1 === 0) { // 每秒记录一次
    console.info(`在t=${time}秒时: 速度=${box.getSpeed().toFixed(2)}`)
  }
}

console.info(`物体在t=${time.toFixed(1)}秒时静止`)
