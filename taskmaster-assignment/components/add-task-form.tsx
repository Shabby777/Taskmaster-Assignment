"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task, TaskPriority, TaskStatus } from "@/types/task"
import { X, Plus } from "lucide-react"

interface AddTaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void
  onCancel: () => void
}

export function AddTaskForm({ onSubmit, onCancel }: AddTaskFormProps) {
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState<TaskPriority>("medium")
  const [status, setStatus] = useState<TaskStatus>("pending")
  const [dueDate, setDueDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !dueDate) return

    setIsSubmitting(true)

    // Add slight delay for animation
    setTimeout(() => {
      onSubmit({
        title: title.trim(),
        priority,
        status,
        dueDate: new Date(dueDate),
      })

      // Reset form
      setTitle("")
      setPriority("medium")
      setStatus("pending")
      setDueDate("")
      setIsSubmitting(false)
    }, 200)
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-scale-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold font-heading flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add New Task</span>
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          aria-label="Close form"
          className="hover:bg-destructive/10 hover:text-destructive transition-colors duration-200 focus-ring"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Task Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              required
              autoFocus
              className="focus-ring transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority
              </Label>
              <Select value={priority} onValueChange={(value: TaskPriority) => setPriority(value)}>
                <SelectTrigger id="priority" className="focus-ring">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="animate-scale-in">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select value={status} onValueChange={(value: TaskStatus) => setStatus(value)}>
                <SelectTrigger id="status" className="focus-ring">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="animate-scale-in">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-sm font-medium">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              min={new Date().toISOString().split("T")[0]}
              className="focus-ring transition-all duration-200"
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="submit"
              className="flex-1 transition-all duration-200 hover:scale-105 focus-ring"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Task"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="bg-transparent hover:bg-accent transition-all duration-200 focus-ring"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
