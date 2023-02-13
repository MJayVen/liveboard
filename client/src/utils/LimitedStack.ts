export default class LimitedStack<T> {
  private stack: T[];
  private limit: number;
  private size: number;
  private head: number;

  public constructor(limit: number) {
    this.stack = [];
    this.limit = limit;
    this.head = 0;
    this.size = 0;
  }

  public push(item: T) {
    this.size = this.size >= this.limit ? this.limit : this.size + 1;
    this.stack[this.head] = item;
    this.head = (this.head + 1) % this.limit;
  }

  public pop() {
    if (this.size === 0) {
      return null;
    }
    let item = this.stack[(this.head - 1 + this.limit) % this.limit];
    this.head = (this.head - 1 + this.limit) % this.limit
    this.size--;
    return item;
  }

  public peek() {
    return this.stack[(this.head - 1 + this.limit) % this.limit];
  }

  public getLength() {
    return this.size;
  }

  public getItems() {
    let res = [];
    for (let i = 0; i < this.size; i++) {
      res.push(this.stack[(this.head + i) % this.limit]);
    }
    return res;
  }
}
