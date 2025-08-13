"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, CheckSquare, Settings, Menu, X, Sun, Moon } from "lucide-react"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  activeView: string
  onViewChange: (view: string) => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
}

export function Sidebar({ collapsed, onToggle, activeView, onViewChange, isDarkMode, onToggleDarkMode }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
          collapsed ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
        onClick={onToggle}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
          "flex flex-col shadow-lg",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center space-x-2 animate-fade-in">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm">
                <CheckSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-sidebar-foreground font-heading">TaskMaster</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent transition-colors duration-200"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              const isActive = activeView === item.id
              return (
                <li key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200",
                      "focus-ring",
                      collapsed && "px-2",
                      isActive && "bg-sidebar-accent shadow-sm",
                    )}
                    onClick={() => onViewChange(item.id)}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-transform duration-200",
                        !collapsed && "mr-3",
                        isActive && "scale-110",
                      )}
                    />
                    {!collapsed && <span className="transition-opacity duration-200">{item.label}</span>}
                  </Button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="px-4 pb-2">
          <Button
            variant="ghost"
            onClick={onToggleDarkMode}
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200 focus-ring",
              collapsed && "px-2 justify-center",
            )}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className={cn("w-5 h-5", !collapsed && "mr-3")} />
            ) : (
              <Moon className={cn("w-5 h-5", !collapsed && "mr-3")} />
            )}
            {!collapsed && <span>Dark Mode</span>}
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className={cn(
              "w-full p-2 h-auto hover:bg-sidebar-accent transition-colors duration-200 focus-ring",
              collapsed ? "justify-center" : "justify-start",
            )}
            onClick={() => onViewChange("profile")}
          >
            <div className={cn("flex items-center", collapsed ? "justify-center" : "space-x-3")}>
              <Avatar className="w-8 h-8 ring-2 ring-primary/20 transition-all duration-200 hover:ring-primary/40">
                <AvatarImage src="/professional-headshot.png" />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">JD</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 min-w-0 text-left animate-fade-in">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">John Doe</p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">john@example.com</p>
                </div>
              )}
            </div>
          </Button>
        </div>
      </aside>
    </>
  )
}
