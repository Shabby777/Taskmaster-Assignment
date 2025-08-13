"use client"

import { Button } from "@/components/ui/button"
import { Plus, Bell, Check, Clock, AlertCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface HeaderProps {
  onAddTask: () => void
  taskCount: number
  completedCount: number
  showAddButton?: boolean
}

export function Header({ onAddTask, taskCount, completedCount, showAddButton = true }: HeaderProps) {
  const [notifications] = useState([
    {
      id: 1,
      type: "overdue",
      title: "Task Overdue",
      message: "Complete project proposal is overdue",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "reminder",
      title: "Upcoming Deadline",
      message: "Review client feedback due tomorrow",
      time: "1 day ago",
      read: false,
    },
    {
      id: 3,
      type: "completed",
      title: "Task Completed",
      message: "Design mockups has been completed",
      time: "2 days ago",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "overdue":
        return <AlertCircle className="w-4 h-4 text-destructive" />
      case "reminder":
        return <Clock className="w-4 h-4 text-warning" />
      case "completed":
        return <Check className="w-4 h-4 text-success" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  return (
    <header className="bg-card border-b border-border px-6 py-4 animate-slide-in-down">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1 transition-colors duration-200">
            {completedCount} of {taskCount} tasks completed
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative bg-transparent hover:bg-accent transition-all duration-200 focus-ring dark:bg-muted dark:hover:bg-muted/80"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full text-xs flex items-center justify-center text-white animate-bounce-in">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex items-start space-x-3 p-3 cursor-pointer ${
                      !notification.read ? "bg-accent/50" : ""
                    }`}
                  >
                    <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                    {!notification.read && <div className="w-2 h-2 bg-primary rounded-full mt-2" />}
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center justify-center text-sm text-muted-foreground">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {showAddButton && (
            <Button
              onClick={onAddTask}
              className="flex items-center space-x-2 transition-all duration-200 hover:scale-105 focus-ring"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Task</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
