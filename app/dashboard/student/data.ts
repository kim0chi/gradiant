"use server"

import { 
  getCurrentUser, 
  getStudentClasses, 
  getStudentGrades, 
  getStudentAttendance,
  getEvents,
  getAssignments
} from '@/lib/supabase'
import { format } from 'date-fns'

// Function to get student dashboard data
export async function getStudentDashboardData() {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user || user.role !== 'student') {
      throw new Error('Unauthorized: Not logged in as a student')
    }

    // Get today's date in ISO format
    const today = new Date()
    const todayISO = today.toISOString().split('T')[0]
    
    // Get student's classes
    const classes = await getStudentClasses(user.id)
    
    // Get student's grades
    const grades = await getStudentGrades(user.id)
    
    // Get student's attendance
    const attendance = await getStudentAttendance(user.id)
    
    // Get upcoming events
    const oneWeekFromNow = new Date()
    oneWeekFromNow.setDate(today.getDate() + 7)
    const events = await getEvents(todayISO, oneWeekFromNow.toISOString().split('T')[0])
    
    // Get upcoming assignments
    const assignments = await getAssignments()
    const upcomingAssignments = assignments
      .filter(assignment => new Date(assignment.due_date) > today)
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
      .slice(0, 5)
    
    // Calculate assignment progress
    const totalAssignments = assignments.length
    const completedAssignments = grades.length
    const percentComplete = totalAssignments > 0 
      ? Math.round((completedAssignments / totalAssignments) * 100) 
      : 0
    const pendingAssignments = totalAssignments - completedAssignments
    
    // Calculate attendance rate
    const attendanceRate = attendance.length > 0
      ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100)
      : 0
    
    // Calculate average grade
    const averageGrade = grades.length > 0
      ? Math.round(grades.reduce((sum, grade) => sum + (grade.score / grade.assignment.total_points) * 100, 0) / grades.length)
      : 0
    
    // Calculate GPA (simplified calculation)
    const gpa = grades.length > 0
      ? parseFloat((grades.reduce((sum, grade) => {
          const percentage = (grade.score / grade.assignment.total_points) * 100
          let gradePoints = 0
          if (percentage >= 90) gradePoints = 4.0
          else if (percentage >= 80) gradePoints = 3.0
          else if (percentage >= 70) gradePoints = 2.0
          else if (percentage >= 60) gradePoints = 1.0
          return sum + gradePoints
        }, 0) / grades.length).toFixed(1))
      : 0
    
    // Format today's classes
    const todaysClasses = classes.map(cls => ({
      id: cls.id,
      name: cls.name,
      period: cls.period,
      room: cls.room,
      time: cls.time,
      teacher: 'Teacher Name' // In a real app, we would fetch the teacher's name
    }))
    
    // Format upcoming events
    const upcomingEventsFormatted = events.map(event => ({
      id: event.id,
      title: event.title,
      time: `${format(new Date(event.start_time), 'h:mm a')} - ${format(new Date(event.end_time), 'h:mm a')}`,
      location: event.location || 'TBD'
    }))
    
    // Format recent grades
    const recentGrades = grades
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 4)
      .map(grade => {
        const percentage = (grade.score / grade.assignment.total_points) * 100
        let letterGrade = 'F'
        if (percentage >= 90) letterGrade = 'A'
        else if (percentage >= 80) letterGrade = 'B'
        else if (percentage >= 70) letterGrade = 'C'
        else if (percentage >= 60) letterGrade = 'D'
        
        return {
          name: grade.assignment.title,
          grade: letterGrade,
          score: `${grade.score}/${grade.assignment.total_points}`
        }
      })
    
    // Format upcoming assignments
    const upcomingAssignmentsFormatted = upcomingAssignments.map(assignment => {
      const dueDate = new Date(assignment.due_date)
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      let dueText = 'Due soon'
      if (diffDays === 0) dueText = 'Due today'
      else if (diffDays === 1) dueText = 'Tomorrow'
      else if (diffDays <= 7) dueText = `In ${diffDays} days`
      else dueText = format(dueDate, 'MMM d')
      
      return {
        name: assignment.title,
        due: dueText,
        class: 'Class Name' // In a real app, we would fetch the class name
      }
    })
    
    // Return all the data needed for the dashboard
    return {
      user,
      assignmentProgress: {
        totalAssignments,
        completedAssignments,
        percentComplete,
        pendingAssignments
      },
      upcomingEvents: upcomingEventsFormatted,
      studentClasses: todaysClasses,
      analyticsData: {
        gpa,
        averageGrade,
        attendanceRate,
        completionRate: percentComplete,
        totalClasses: classes.length
      },
      recentGrades,
      upcomingAssignments: upcomingAssignmentsFormatted
    }
  } catch (error) {
    console.error('Error fetching student dashboard data:', error)
    // Return default data structure with empty values
    return {
      user: null,
      assignmentProgress: {
        totalAssignments: 0,
        completedAssignments: 0,
        percentComplete: 0,
        pendingAssignments: 0
      },
      upcomingEvents: [],
      studentClasses: [],
      analyticsData: {
        gpa: 0,
        averageGrade: 0,
        attendanceRate: 0,
        completionRate: 0,
        totalClasses: 0
      },
      recentGrades: [],
      upcomingAssignments: []
    }
  }
}
