import {
  Application,
  Assets,
  Container,
  Sprite,
} from 'pixi.js'

// Create a new application
const app = new Application()

const containerElement = document.getElementById('app')!

// Initialize the application
await app.init({
  resizeTo: containerElement,
  preference: 'webgpu',
})
const { stage, ticker, canvas } = app

// Append the application canvas to the document body
containerElement.appendChild(canvas)

// Create and add a container to the stage
const container = new Container()

stage.addChild(container)

// Load the bunny texture
const texture = await Assets.load('https://pixijs.com/assets/bunny.png')

// Create a 5x5 grid of bunnies in the container
for (let i = 0; i < 25; i++) {
  const bunny = new Sprite(texture)

  bunny.x = (i % 5) * 40
  bunny.y = Math.floor(i / 5) * 40
  container.addChild(bunny)
}

// Move the container to the center
container.x = app.screen.width / 2
container.y = app.screen.height / 2

// Center the bunny sprites in local container coordinates
container.pivot.x = container.width / 2
container.pivot.y = container.height / 2

// Listen for animate update
ticker.add((time) => {
  // Continuously rotate the container!
  // * use delta to create frame-independent transform *
  container.rotation -= 0.01 * time.deltaTime
})
