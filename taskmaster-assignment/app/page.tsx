"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { TaskGrid } from "@/components/task-grid"
import { AddTaskForm } from "@/components/add-task-form"
import { UserProfile } from "@/components/user-profile"
import { Settings } from "@/components/settings"
import { useApp } from "@/contexts/app-context"

export default function Dashboard() {
  const { state, actions } = useApp()

  const renderContent = () => {
    switch (state.activeView) {
      case "profile":
        return <UserProfile />
      case "settings":
        return <Settings />
      case "tasks":
      case "dashboard":
      default:
        return (
          <main className="p-6">
            {state.showAddForm && (
              <div className="mb-6 animate-slide-in-down">
                <AddTaskForm onSubmit={actions.addTask} onCancel={() => actions.setShowAddForm(false)} />
              </div>
            )}
            <TaskGrid
              tasks={state.tasks}
              onUpdateStatus={actions.updateTaskStatus}
              onDelete={actions.deleteTask}
              deletingTaskId={state.deletingTaskId}
            />
          </main>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="flex">
        <Sidebar
          collapsed={state.sidebarCollapsed}
          onToggle={actions.toggleSidebar}
          activeView={state.activeView}
          onViewChange={actions.setActiveView}
          isDarkMode={state.isDarkMode}
          onToggleDarkMode={actions.toggleDarkMode}
        />

        <div className={`flex-1 transition-all duration-300 ${state.sidebarCollapsed ? "ml-16" : "ml-64"} lg:ml-64`}>
          <Header
            onAddTask={() => actions.setShowAddForm(true)}
            taskCount={state.tasks.length}
            completedCount={state.tasks.filter((t) => t.status === "completed").length}
            showAddButton={state.activeView === "dashboard" || state.activeView === "tasks"}
          />

          {renderContent()}
        </div>
      </div>
    </div>
  )
}
