// Mock authentication functions for development purposes
// In a real application, these would be replaced with actual authentication logic

// Store user data in localStorage
const USER_KEY = "gradiant_user"

// User type definition
type User = {
  id: string
  name: string
  email: string
  role: "teacher" | "admin" | "student"
  avatar?: string
}

// Mock user data
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Teacher",
    email: "teacher@example.com",
    role: "teacher",
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: "3",
    name: "Student User",
    email: "student@example.com",
    role: "student",
  },
]

// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(USER_KEY) !== null
}

// Get current user
export function getUser(): User | null {
  if (typeof window === "undefined") return null
  const userData = localStorage.getItem(USER_KEY)
  return userData ? JSON.parse(userData) : null
}

// Get user role
export function getUserRole(): "teacher" | "admin" | "student" | null {
  const user = getUser()
  return user ? user.role : null
}

// Mock login function
export function login(email: string, password: string): boolean {
  // In a real app, you would validate credentials against a backend
  const user = mockUsers.find((u) => u.email === email)

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return true
  }

  return false
}

// Mock logout function
export function clearUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(USER_KEY)
}

// Set mock user for development
export function setMockUser(role: "teacher" | "admin" | "student"): void {
  const user = mockUsers.find((u) => u.role === role)
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

// Simple mock authentication service for demo purposes
// This will be replaced with Supabase authentication later

export type UserRole = "teacher" | "admin" | "student" | null

interface MockUser {
  role: UserRole
  name: string
  email: string
  id: string
  institutional?: boolean
  password_changed_at?: string | null
}

const DEFAULT_USERS: Record<string, Omit<MockUser, "role" | "id">> = {
  teacher: {
    name: "Jane Smith",
    email: "teacher@example.com",
  },
  admin: {
    name: "Admin User",
    email: "admin@example.com",
  },
  student: {
    name: "John Doe",
    email: "student@example.com",
  },
}

export function setUserRole(role: "teacher" | "admin" | "student"): void {
  const user: MockUser = {
    role,
    id: `mock-${role}-id`,
    ...DEFAULT_USERS[role],
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// Mock authentication for testing without Supabase

// Check if we're in debug mode
export function isDebugMode() {
  return (
    typeof window !== "undefined" &&
    (localStorage.getItem("MOCK_AUTH_ENABLED") === "true" || process.env.NEXT_PUBLIC_DEBUG === "true")
  )
}

// Get the current mock user
export function getMockUser(): MockUser | null {
  if (!isDebugMode()) return null

  const userJson = localStorage.getItem(USER_KEY)
  if (!userJson) return null

  try {
    return JSON.parse(userJson) as MockUser
  } catch (e) {
    console.error("Error parsing mock user:", e)
    return null
  }
}

// Mock classes data
export function getMockClassesData() {
  return [
    { id: "class-1", name: "Mathematics 101", period: 1 },
    { id: "class-2", name: "Science 101", period: 2 },
    { id: "class-3", name: "History 101", period: 3 },
    { id: "class-4", name: "English 101", period: 4 },
  ]
}

// Mock students data
export function getMockStudentsData() {
  return [
    { id: "student-1", full_name: "Alice Johnson" },
    { id: "student-2", full_name: "Bob Smith" },
    { id: "student-3", full_name: "Charlie Brown" },
    { id: "student-4", full_name: "Diana Prince" },
  ]
}

// Mock tasks data
export function getMockTasksData() {
  return [
    { id: "task-1", title: "Quiz 1", max_points: 100 },
    { id: "task-2", title: "Homework 1", max_points: 50 },
    { id: "task-3", title: "Midterm Exam", max_points: 200 },
  ]
}

// Mock grades data
export function getMockGradesData() {
  return [
    { id: "grade-1", student_id: "student-1", task_id: "task-1", score: 85 },
    { id: "grade-2", student_id: "student-1", task_id: "task-2", score: 45 },
    { id: "grade-3", student_id: "student-2", task_id: "task-1", score: 92 },
    { id: "grade-4", student_id: "student-2", task_id: "task-2", score: 48 },
    { id: "grade-5", student_id: "student-3", task_id: "task-1", score: 78 },
    { id: "grade-6", student_id: "student-4", task_id: "task-1", score: 88 },
  ]
}

// Mock attendance data
export function getMockAttendanceData() {
  return [
    { id: "att-1", student_id: "student-1", date: "2023-05-01", status: "present" },
    { id: "att-2", student_id: "student-2", date: "2023-05-01", status: "absent" },
    { id: "att-3", student_id: "student-3", date: "2023-05-01", status: "tardy" },
    { id: "att-4", student_id: "student-4", date: "2023-05-01", status: "present" },
  ]
}

const createMockClient = () => {
  return {
    auth: {
      getSession: async () => {
        const user = getMockUser()
        if (!user) return { data: { session: null }, error: null }
        return {
          data: {
            session: {
              access_token: "mock_access_token",
              token_type: "bearer",
              expires_in: 3600,
              refresh_token: "mock_refresh_token",
              user: {
                id: "mock-user-id",
                app_metadata: {},
                user_metadata: { full_name: user.name },
                aud: "authenticated",
                created_at: new Date().toISOString(),
              },
            },
          },
          error: null,
        }
      },
      getUser: async () => {
        const user = getMockUser()
        if (!user) return { data: { user: null }, error: null }
        return {
          data: {
            user: {
              id: "mock-user-id",
              app_metadata: {},
              user_metadata: { full_name: user.name },
              aud: "authenticated",
              created_at: new Date().toISOString(),
            },
          },
          error: null,
        }
      },
      signOut: async () => {
        clearUser()
        return { data: {}, error: null }
      },
      updateUser: async () => {
        return { data: {}, error: null }
      },
      resetPasswordForEmail: async () => {
        return { data: {}, error: null }
      },
      signUp: async () => {
        return { data: {}, error: null }
      },
      admin: {
        createUser: async () => {
          return { data: {}, error: null }
        },
        deleteUser: async () => {
          return { data: {}, error: null }
        },
      },
    },
    from: () => {
      return {
        select: () => {
          return {
            eq: () => {
              return {
                single: async () => {
                  return { data: {}, error: null }
                },
                order: () => {
                  return {
                    single: async () => {
                      return { data: {}, error: null }
                    },
                    then: () => {},
                  }
                },
              }
            },
            order: () => {
              return {
                then: () => {},
              }
            },
          }
        },
        insert: () => {
          return {
            select: () => {
              return {
                single: async () => {
                  return { data: {}, error: null }
                },
              }
            },
          }
        },
        update: () => {
          return {
            eq: () => {
              return {
                select: () => {
                  return {
                    single: async () => {
                      return { data: {}, error: null }
                    },
                  }
                },
              }
            },
          }
        },
      }
    },
    channel: () => {
      return {
        on: () => {
          return {
            subscribe: () => {
              return {
                unsubscribe: () => {},
              }
            },
          }
        },
      }
    },
  }
}

export { createMockClient }
