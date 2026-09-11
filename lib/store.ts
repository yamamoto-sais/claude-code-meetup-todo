import { promises as fs } from "fs";
import path from "path";
import { type Priority } from "./priority";

export type { Priority };

export type Todo = {
  id: string;
  title: string;
  dueDate: string | null;
  completed: boolean;
  priority: Priority;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "todos.json");

function seedTodos(): Todo[] {
  const day = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };
  const now = new Date().toISOString();
  return [
    { id: "t1", title: "週報を提出する", dueDate: day(-2), completed: false, priority: "high", createdAt: now },
    { id: "t2", title: "リリースノートをレビューする", dueDate: day(0), completed: false, priority: "medium", createdAt: now },
    { id: "t3", title: "検証環境のライブラリを更新する", dueDate: day(7), completed: false, priority: "low", createdAt: now },
    { id: "t4", title: "朝会の議事録を共有する", dueDate: null, completed: true, priority: "medium", createdAt: now },
  ];
}

async function load(): Promise<Todo[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const todos = JSON.parse(raw) as Todo[];
    return todos.map((t) => ({ priority: "medium" as const, ...t }));
  } catch {
    const todos = seedTodos();
    await save(todos);
    return todos;
  }
}

async function save(todos: Todo[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), "utf-8");
}

export async function listTodos(): Promise<Todo[]> {
  return load();
}

export async function addTodo(
  title: string,
  dueDate: string | null,
  priority: Priority = "medium"
): Promise<Todo> {
  const todos = await load();
  const todo: Todo = {
    id: Math.random().toString(36).slice(2, 10),
    title,
    dueDate,
    completed: false,
    priority,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  await save(todos);
  return todo;
}

export async function updateTodo(
  id: string,
  patch: Partial<Pick<Todo, "title" | "dueDate" | "completed">>
): Promise<Todo | null> {
  const todos = await load();
  const todo = todos.find((t) => t.id === id);
  if (!todo) return null;
  Object.assign(todo, patch);
  await save(todos);
  return todo;
}

export async function toggleTodo(id: string): Promise<Todo | null> {
  const todos = await load();
  const todo = todos.find((t) => t.id === id);
  if (!todo) return null;
  todo.completed = !todo.completed;
  await save(todos);
  return todo;
}

export async function deleteTodo(id: string): Promise<boolean> {
  const todos = await load();
  const next = todos.filter((t) => t.id !== id);
  if (next.length === todos.length) return false;
  await save(next);
  return true;
}
