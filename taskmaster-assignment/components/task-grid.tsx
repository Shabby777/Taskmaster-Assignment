"use client"

import { TaskCard } from "./task-card"
import type { Task, TaskStatus } from "@/types/task"

interface TaskGridProps {
  tasks: Task[]
  onUpdateStatus: (taskId: string, status: TaskStatus) => void
  onDelete: (taskId: string) => void
  deletingTaskId?: string | null
}

export function TaskGrid({ tasks, onUpdateStatus, onDelete, deletingTaskId }: TaskGridProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 animate-bounce-in">
          <span className="text-2xl">📝</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2 font-heading">No tasks yet</h3>
        <p className="text-muted-foreground">Create your first task to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tasks.map((task, index) => (
        <div key={task.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <TaskCard
            task={task}
            onUpdateStatus={onUpdateStatus}
            onDelete={onDelete}
            isDeleting={deletingTaskId === task.id}
          />
        </div>
      ))}
    </div>
  )
}
