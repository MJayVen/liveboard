import LimitedStack from "../src/utils/LimitedStack";
import { describe, expect, it } from "vitest";

describe("#LimitedStack", () => {
  it("should push and pop", () => {
    const stack = new LimitedStack(3);
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.peek()).toBe(3);
    expect(stack.pop()).toBe(3);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(1);
    expect(stack.pop()).toBe(null);
  });

  it("should limit the size", () => {
    const stack = new LimitedStack(3);
    stack.push(1);
    stack.push(2);
    stack.push(3);
    stack.push(4);
    expect(stack.getLength()).toBe(3);
    expect(stack.pop()).toBe(4);
    expect(stack.pop()).toBe(3);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(null);
  });

  it("should get items", () => {
    const stack = new LimitedStack(3);
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.getItems()).toEqual([1, 2, 3]);
    stack.push(4);
    expect(stack.getItems()).toEqual([2, 3, 4]);
  });
});
