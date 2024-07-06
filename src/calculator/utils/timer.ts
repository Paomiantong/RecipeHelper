type TimerCallback = () => void;

export class EfficientTimer {
  private intervalId: number | null = null;
  private interval: number;
  private callbacks: TimerCallback[] = [];

  constructor(interval: number) {
    this.interval = interval; // 单位是毫秒
  }

  // 启动或重启定时器
  start(): void {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.callbacks.forEach((callback) => callback());
      }, this.interval);
    }
  }

  // 停止定时器并计算剩余时间
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // 添加回调函数
  addCallback(callback: TimerCallback): void {
    this.callbacks.push(callback);
  }

  // 移除回调函数
  removeCallback(callback: TimerCallback): void {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback);
  }

  // 重置定时器
  reset(): void {
    this.stop();
    this.start();
  }
}
