import { describe, it, expect } from "vitest";
import { sortByPriority } from "./priority";
import type { Todo } from "./store";

function makeTodo(overrides: Partial<Todo>): Todo {
  return {
    id: "x",
    title: "test",
    dueDate: null,
    completed: false,
    priority: "medium",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("sortByPriority", () => {
  it("high → medium → low の順に並ぶ", () => {
    const todos = [
      makeTodo({ id: "1", priority: "low" }),
      makeTodo({ id: "2", priority: "high" }),
      makeTodo({ id: "3", priority: "medium" }),
    ];
    const result = sortByPriority(todos);
    expect(result.map((t) => t.priority)).toEqual(["high", "medium", "low"]);
  });

  it("同一優先度内は元の順序を維持する (stable sort)", () => {
    const todos = [
      makeTodo({ id: "a", priority: "medium", createdAt: "2026-01-01T00:00:00Z" }),
      makeTodo({ id: "b", priority: "high", createdAt: "2026-01-02T00:00:00Z" }),
      makeTodo({ id: "c", priority: "medium", createdAt: "2026-01-03T00:00:00Z" }),
    ];
    const result = sortByPriority(todos);
    expect(result.map((t) => t.id)).toEqual(["b", "a", "c"]);
  });

  it("元の配列を変更しない", () => {
    const todos = [
      makeTodo({ id: "1", priority: "low" }),
      makeTodo({ id: "2", priority: "high" }),
    ];
    const original = [...todos];
    sortByPriority(todos);
    expect(todos.map((t) => t.id)).toEqual(original.map((t) => t.id));
  });
});
