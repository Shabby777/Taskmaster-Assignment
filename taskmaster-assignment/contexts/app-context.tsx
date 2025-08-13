"use client"

import type React from "react"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { Task, TaskStatus } from "@/types/task"

// Sample initial tasks
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Finish quarterly report",
    priority: "high",
    status: "in-progress",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Review team performance",
    priority: "medium",
    status: "pending",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Update project documentation",
    priority: "low",
    status: "completed",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  },
  {
    id: "4",
    title: "Prepare client presentation",
    priority: "high",
    status: "pending",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  },
]

interface AppState {
  tasks: Task[]
  sidebarCollapsed: boolean
  showAddForm: boolean
  activeView: string
  deletingTaskId: string | null
  isDarkMode: boolean
}

type AppAction =
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Omit<Task, "id" | "createdAt"> }
  | { type: "UPDATE_TASK_STATUS"; payload: { taskId: string; status: TaskStatus } }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "SET_DELETING_TASK"; payload: string | null }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SHOW_ADD_FORM"; payload: boolean }
  | { type: "SET_ACTIVE_VIEW"; payload: string }
  | { type: "TOGGLE_DARK_MODE" }
  | { type: "SET_DARK_MODE"; payload: boolean }

const initialState: AppState = {
  tasks: [],
  sidebarCollapsed: false,
  showAddForm: false,
  activeView: "dashboard",
  deletingTaskId: null,
  isDarkMode: false,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_TASKS":
      return { ...state, tasks: action.payload }
    case "ADD_TASK":
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date(),
      }
      return { ...state, tasks: [newTask, ...state.tasks], showAddForm: false }
    case "UPDATE_TASK_STATUS":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.taskId ? { ...task, status: action.payload.status } : task,
        ),
      }
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        deletingTaskId: null,
      }
    case "SET_DELETING_TASK":
      return { ...state, deletingTaskId: action.payload }
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed }
    case "SET_SHOW_ADD_FORM":
      return { ...state, showAddForm: action.payload }
    case "SET_ACTIVE_VIEW":
      return { ...state, activeView: action.payload }
    case "TOGGLE_DARK_MODE":
      return { ...state, isDarkMode: !state.isDarkMode }
    case "SET_DARK_MODE":
      return { ...state, isDarkMode: action.payload }
    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  actions: {
    addTask: (taskData: Omit<Task, "id" | "createdAt">) => void
    updateTaskStatus: (taskId: string, status: TaskStatus) => void
    deleteTask: (taskId: string) => void
    toggleSidebar: () => void
    setShowAddForm: (show: boolean) => void
    setActiveView: (view: string) => void
    toggleDarkMode: () => void
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load initial data
  useEffect(() => {
    const savedTasks = localStorage.getItem("taskmaster-tasks")
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
      }))
      dispatch({ type: "SET_TASKS", payload: parsedTasks })
    } else {
      dispatch({ type: "SET_TASKS", payload: initialTasks })
    }

    const savedDarkMode = localStorage.getItem("taskmaster-dark-mode")
    if (savedDarkMode === "true") {
      dispatch({ type: "SET_DARK_MODE", payload: true })
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Save tasks to localStorage
  useEffect(() => {
    if (state.tasks.length > 0) {
      localStorage.setItem("taskmaster-tasks", JSON.stringify(state.tasks))
    }
  }, [state.tasks])

  // Handle dark mode changes
  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("taskmaster-dark-mode", state.isDarkMode.toString())
  }, [state.isDarkMode])

  const actions = {
    addTask: (taskData: Omit<Task, "id" | "createdAt">) => {
      dispatch({ type: "ADD_TASK", payload: taskData })
    },
    updateTaskStatus: (taskId: string, status: TaskStatus) => {
      dispatch({ type: "UPDATE_TASK_STATUS", payload: { taskId, status } })
    },
    deleteTask: (taskId: string) => {
      dispatch({ type: "SET_DELETING_TASK", payload: taskId })
      setTimeout(() => {
        dispatch({ type: "DELETE_TASK", payload: taskId })
      }, 300)
    },
    toggleSidebar: () => {
      dispatch({ type: "TOGGLE_SIDEBAR" })
    },
    setShowAddForm: (show: boolean) => {
      dispatch({ type: "SET_SHOW_ADD_FORM", payload: show })
    },
    setActiveView: (view: string) => {
      dispatch({ type: "SET_ACTIVE_VIEW", payload: view })
    },
    toggleDarkMode: () => {
      dispatch({ type: "TOGGLE_DARK_MODE" })
    },
  }

  return <AppContext.Provider value={{ state, dispatch, actions }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
