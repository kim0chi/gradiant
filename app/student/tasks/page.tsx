'use client'

import { useState, useEffect } from 'react'
import AppLayout from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"
import { format } from "date-fns"

export default function StudentTasksPage() {
  // Mock data for tasks
  const [taskSummary, setTaskSummary] = useState({
    upcoming: 5,
    completed: 24,
    overdue: 0
  })

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Math Problem Set",
      subject: "Mathematics",
      dueDate: "Tomorrow, 11:59 PM",
      status: "upcoming"
    },
    {
      id: 2,
      title: "History Research Paper",
      subject: "History",
      dueDate: "May 15, 2023",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Science Lab Report",
      subject: "Science",
      dueDate: "May 18, 2023",
      status: "upcoming"
    },
    {
      id: 4,
      title: "English Essay Draft",
      subject: "English",
      dueDate: "May 20, 2023",
      status: "upcoming"
    },
    {
      id: 5,
      title: "Physics Problem Set",
      subject: "Physics",
      dueDate: "May 22, 2023",
      status: "upcoming"
    }
  ])

  return (
    <AppLayout userRole="student">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">My Tasks</h1>
        
        {/* Task Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Upcoming</h3>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">{taskSummary.upcoming}</span>
                  <span className="text-xs text-muted-foreground">Tasks due soon</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">{taskSummary.completed}</span>
                  <span className="text-xs text-muted-foreground">Tasks completed</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Overdue</h3>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">{taskSummary.overdue}</span>
                  <span className="text-xs text-muted-foreground">No overdue tasks</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Task List */}
        <Card>
          <CardHeader>
            <CardTitle>Task List</CardTitle>
            <p className="text-sm text-muted-foreground">View and manage your assignments and tasks</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {task.subject} • Due: {task.dueDate}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={
                      task.status === "completed" 
                        ? "bg-green-100 text-green-800" 
                        : task.status === "overdue" 
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                    }
                  >
                    {task.status === "completed" ? "Completed" : task.status === "overdue" ? "Overdue" : "Upcoming"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}