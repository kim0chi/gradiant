import { createClient } from '@supabase/supabase-js'

// These environment variables are set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for our database tables
export type User = {
  id: string
  email: string
  name: string
  role: 'teacher' | 'student' | 'admin'
  created_at: string
  avatar_url?: string
}

export type Class = {
  id: string
  name: string
  period: string
  room: string
  time: string
  teacher_id: string
  created_at: string
}

export type Assignment = {
  id: string
  title: string
  description: string
  due_date: string
  class_id: string
  created_at: string
  total_points: number
}

export type Grade = {
  id: string
  student_id: string
  assignment_id: string
  score: number
  feedback?: string
  created_at: string
}

export type Attendance = {
  id: string
  student_id: string
  class_id: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  created_at: string
}

export type Event = {
  id: string
  title: string
  description?: string
  start_time: string
  end_time: string
  location?: string
  created_at: string
}

export type StudentClass = {
  id: string
  student_id: string
  class_id: string
  created_at: string
}

// Helper functions for common database operations
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
    
  return data as User | null
}

export async function getClasses(teacherId?: string): Promise<Class[]> {
  let query = supabase.from('classes').select('*')
  
  if (teacherId) {
    query = query.eq('teacher_id', teacherId)
  }
  
  const { data, error } = await query.order('period')
  
  if (error) {
    console.error('Error fetching classes:', error)
    return []
  }
  
  return data as Class[]
}

export async function getStudentClasses(studentId: string): Promise<Class[]> {
  const { data, error } = await supabase
    .from('student_classes')
    .select('class_id')
    .eq('student_id', studentId)
  
  if (error || !data.length) {
    console.error('Error fetching student classes:', error)
    return []
  }
  
  const classIds = data.map(sc => sc.class_id)
  
  const { data: classes, error: classesError } = await supabase
    .from('classes')
    .select('*')
    .in('id', classIds)
    .order('period')
  
  if (classesError) {
    console.error('Error fetching classes:', classesError)
    return []
  }
  
  return classes as Class[]
}

export async function getAssignments(classId?: string): Promise<Assignment[]> {
  let query = supabase.from('assignments').select('*')
  
  if (classId) {
    query = query.eq('class_id', classId)
  }
  
  const { data, error } = await query.order('due_date')
  
  if (error) {
    console.error('Error fetching assignments:', error)
    return []
  }
  
  return data as Assignment[]
}

export async function getStudentGrades(studentId: string, classId?: string): Promise<(Grade & { assignment: Assignment })[]> {
  let query = supabase
    .from('grades')
    .select(`
      *,
      assignment:assignments(*)
    `)
    .eq('student_id', studentId)
  
  if (classId) {
    query = query.eq('assignment.class_id', classId)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching grades:', error)
    return []
  }
  
  return data as (Grade & { assignment: Assignment })[]
}

export async function getAttendance(classId: string, date?: string): Promise<(Attendance & { student: User })[]> {
  let query = supabase
    .from('attendance')
    .select(`
      *,
      student:users(*)
    `)
    .eq('class_id', classId)
  
  if (date) {
    query = query.eq('date', date)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching attendance:', error)
    return []
  }
  
  return data as (Attendance & { student: User })[]
}

export async function getStudentAttendance(studentId: string, classId?: string): Promise<Attendance[]> {
  let query = supabase
    .from('attendance')
    .select('*')
    .eq('student_id', studentId)
  
  if (classId) {
    query = query.eq('class_id', classId)
  }
  
  const { data, error } = await query.order('date', { ascending: false })
  
  if (error) {
    console.error('Error fetching student attendance:', error)
    return []
  }
  
  return data as Attendance[]
}

export async function getEvents(startDate?: string, endDate?: string): Promise<Event[]> {
  let query = supabase.from('events').select('*')
  
  if (startDate) {
    query = query.gte('start_time', startDate)
  }
  
  if (endDate) {
    query = query.lte('end_time', endDate)
  }
  
  const { data, error } = await query.order('start_time')
  
  if (error) {
    console.error('Error fetching events:', error)
    return []
  }
  
  return data as Event[]
}

export async function getStudentsInClass(classId: string): Promise<User[]> {
  const { data, error } = await supabase
    .from('student_classes')
    .select('student_id')
    .eq('class_id', classId)
  
  if (error || !data.length) {
    console.error('Error fetching students in class:', error)
    return []
  }
  
  const studentIds = data.map(sc => sc.student_id)
  
  const { data: students, error: studentsError } = await supabase
    .from('users')
    .select('*')
    .in('id', studentIds)
    .eq('role', 'student')
    .order('name')
  
  if (studentsError) {
    console.error('Error fetching students:', studentsError)
    return []
  }
  
  return students as User[]
}
