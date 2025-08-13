"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Task, TaskStatus } from "@/types/task"
import { Trash2, Check, Clock, AlertCircle, RotateCcw } from "lucide-react"

interface TaskCardProps {
  task: Task
  onUpdateStatus: (taskId: string, status: TaskStatus) => void
  onDelete: (taskId: string) => void
  isDeleting?: boolean
}

const priorityConfig = {
  low: { color: "bg-green-500", label: "Low", variant: "secondary" as const },
  medium: { color: "bg-yellow-500", label: "Medium", variant: "outline" as const },
  high: { color: "bg-red-500", label: "High", variant: "destructive" as const },
}

const statusConfig = {
  pending: { label: "Pending", icon: Clock, variant: "outline" as const },
  "in-progress": { label: "In Progress", icon: AlertCircle, variant: "default" as const },
  completed: { label: "Completed", icon: Check, variant: "secondary" as const },
}

export function TaskCard({ task, onUpdateStatus, onDelete, isDeleting = false }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const priority = priorityConfig[task.priority]
  const status = statusConfig[task.status]
  const StatusIcon = status.icon

  const daysUntilDue = Math.ceil((task.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const isOverdue = daysUntilDue < 0
  const isDueToday = daysUntilDue === 0

  const getDueDateText = () => {
    if (isOverdue) return `Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? "s" : ""}`
    if (isDueToday) return "Due today"
    return `Due in ${daysUntilDue} day${daysUntilDue !== 1 ? "s" : ""}`
  }

  const handleMarkComplete = () => {
    setIsCompleting(true)
    setTimeout(() => {
      const newStatus = task.status === "completed" ? "pending" : "completed"
      onUpdateStatus(task.id, newStatus)
      setIsCompleting(false)
    }, 200)
  }

  return (
    <Card
      className={cn(
        "task-card-hover transition-all duration-300 cursor-pointer group animate-scale-in",
        "border-2 border-transparent hover:border-primary/20",
        task.status === "completed" && "opacity-75 bg-muted/30",
        isDeleting && "animate-slide-out",
        isCompleting && "animate-bounce-in",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className={cn("w-3 h-3 rounded-full transition-all duration-200", priority.color)} />
            <Badge
              variant={priority.variant}
              className={cn(
                "text-xs transition-all duration-200 hover:scale-105",
                task.priority === "high" && "text-white",
              )}
            >
              {priority.label}
            </Badge>
          </div>

          {/* Action buttons - show on hover */}
          <div
            className={cn(
              "flex items-center space-x-1 transition-all duration-300",
              isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2",
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-8 h-8 transition-all duration-200 focus-ring",
                task.status === "completed"
                  ? "hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20"
                  : "hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20",
              )}
              onClick={handleMarkComplete}
              aria-label={task.status === "completed" ? "Mark as pending" : "Mark as completed"}
            >
              {task.status === "completed" ? <RotateCcw className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 transition-all duration-200 focus-ring"
              onClick={() => onDelete(task.id)}
              aria-label="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <h3
          className={cn(
            "font-semibold text-foreground mb-3 leading-tight font-heading transition-all duration-200",
            task.status === "completed" && "line-through text-muted-foreground",
            task.priority === "high" && task.status !== "completed" && "text-red-600 dark:text-red-400",
            task.priority === "medium" && task.status !== "completed" && "text-yellow-600 dark:text-yellow-400",
            task.priority === "low" && task.status !== "completed" && "text-green-600 dark:text-green-400",
          )}
        >
          {task.title}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant={status.variant} className="flex items-center space-x-1 transition-all duration-200">
              <StatusIcon className="w-3 h-3" />
              <span>{status.label}</span>
            </Badge>
          </div>

          <p
            className={cn(
              "text-sm transition-colors duration-200",
              isOverdue
                ? "text-red-600 dark:text-red-400 font-medium"
                : isDueToday
                  ? "text-yellow-600 dark:text-yellow-400 font-medium"
                  : "text-muted-foreground",
            )}
          >
            {getDueDateText()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
