export type TaskPriority = "low" | "medium" | "high"
export type TaskStatus = "pending" | "in-progress" | "completed"

export interface Task {
  id: string
  title: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: Date
  createdAt: Date
}
