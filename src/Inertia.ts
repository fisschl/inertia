/**
 * A class representing an object with inertia in n-dimensional space.
 * The object's position changes over time based on its velocity,
 * and friction gradually reduces the velocity until it stops.
 */
export class Inertia {
  private _position: number[];
  private _velocity: number[];
  private readonly friction: number;

  /**
   * Creates a new Inertia object.
   * @param initialPosition - The initial position as an array of numbers (n-dimensional)
   * @param friction - The friction coefficient (0-1, where 1 means no friction and 0 means immediate stop)
   */
  constructor(initialPosition: number[], friction: number) {
    if (friction < 0 || friction > 1) {
      throw new Error("Friction must be between 0 and 1");
    }

    this._position = [...initialPosition];
    this._velocity = new Array(initialPosition.length).fill(0);
    this.friction = friction;
  }

  /**
   * Gets the current position.
   */
  get position(): number[] {
    return [...this._position];
  }

  /**
   * Gets the current velocity.
   */
  get velocity(): number[] {
    return [...this._velocity];
  }

  /**
   * Gets the friction coefficient.
   */
  get frictionCoefficient(): number {
    return this.friction;
  }

  /**
   * Updates the position based on the current velocity and applies friction.
   * @param deltaTime - Time elapsed since last update (in seconds)
   */
  update(deltaTime: number): void {
    // Update position based on velocity
    for (let i = 0; i < this._position.length; i++) {
      this._position[i] += this._velocity[i] * deltaTime;
    }

    // Apply friction to reduce velocity
    for (let i = 0; i < this._velocity.length; i++) {
      this._velocity[i] *= Math.pow(this.friction, deltaTime);
      
      // If velocity is very small, set it to zero to prevent infinite sliding
      if (Math.abs(this._velocity[i]) < 1e-10) {
        this._velocity[i] = 0;
      }
    }
  }

  /**
   * Applies an impulse to the object, changing its velocity.
   * @param impulse - The impulse vector to apply
   */
  applyImpulse(impulse: number[]): void {
    if (impulse.length !== this._velocity.length) {
      throw new Error("Impulse dimension must match position/velocity dimension");
    }

    for (let i = 0; i < this._velocity.length; i++) {
      this._velocity[i] += impulse[i];
    }
  }

  /**
   * Sets the velocity directly.
   * @param velocity - The new velocity vector
   */
  setVelocity(velocity: number[]): void {
    if (velocity.length !== this._velocity.length) {
      throw new Error("Velocity dimension must match position/velocity dimension");
    }

    this._velocity = [...velocity];
  }

  /**
   * Checks if the object is currently at rest (not moving).
   */
  isAtRest(): boolean {
    return this._velocity.every(v => v === 0);
  }

  /**
   * Gets the current speed (magnitude of velocity vector).
   */
  get speed(): number {
    return Math.sqrt(this._velocity.reduce((sum, v) => sum + v * v, 0));
  }

  /**
   * Gets the dimensionality of the space.
   */
  get dimensions(): number {
    return this._position.length;
  }
}