export class Timer {
  constructor() {
    this.delta = 0;
    this.lastUpdate = Date.now();
  }

  calcDeltaTime() {
    const now = Date.now();
    this.delta = (now - this.lastUpdate) / 10;
    this.lastUpdate = now;
  }
}
