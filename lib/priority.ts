export type Priority = "high" | "medium" | "low";

export const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export interface PrioritizedItem {
  priority: Priority;
}

export function sortByPriority<T extends PrioritizedItem>(items: T[]): T[] {
  return [...items].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
}
