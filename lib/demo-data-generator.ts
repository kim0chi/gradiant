import { faker } from "@faker-js/faker"

export type UserRole = "admin" | "teacher" | "student"

export interface DemoUser {
  email: string
  full_name: string
  role: UserRole
  department?: string
  subject?: string
  grade_level?: number
  joined_date: string
  last_active?: string
  status: "active" | "inactive" | "pending"
  avatar_url?: string
}

// Set seed for consistent data generation
faker.seed(123)

// Generate a deterministic avatar URL based on the user's name
const generateAvatarUrl = (name: string, gender?: "male" | "female") => {
  const style = gender === "female" ? "women" : "men"
  // This creates a consistent avatar for the same name
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100
  return `https://randomuser.me/api/portraits/${style}/${hash}.jpg`
}

// Generate teacher subjects
const teacherSubjects = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Art",
  "Music",
  "Physical Education",
  "Foreign Languages",
  "Social Studies",
  "Economics",
]

// Generate admin departments
const adminDepartments = [
  "School Administration",
  "IT Department",
  "Student Affairs",
  "Curriculum Development",
  "Human Resources",
  "Finance",
  "Facilities Management",
]

// Generate a realistic school email
const generateSchoolEmail = (name: string, role: UserRole, domain = "gradiant.edu") => {
  const [firstName, lastName] = name.split(" ")
  const sanitizedLastName = lastName?.replace(/[^a-zA-Z]/g, "") || ""

  if (role === "admin") {
    return `${firstName.toLowerCase()}.${sanitizedLastName.toLowerCase()}@${domain}`
  } else if (role === "teacher") {
    return `${firstName.toLowerCase()[0]}${sanitizedLastName.toLowerCase()}@${domain}`
  } else {
    // Students get numbers in their emails
    const studentId = faker.number.int({ min: 1000, max: 9999 })
    return `${firstName.toLowerCase()[0]}${sanitizedLastName.toLowerCase()}${studentId}@${domain}`
  }
}

// Generate a single demo user
export const generateDemoUser = (role: UserRole, index: number): DemoUser => {
  const gender = faker.person.sex() as "male" | "female"
  const firstName = faker.person.firstName(gender)
  const lastName = faker.person.lastName()
  const fullName = `${firstName} ${lastName}`

  // Base user properties
  const user: DemoUser = {
    full_name: fullName,
    email: generateSchoolEmail(fullName, role),
    role,
    joined_date: faker.date.past({ years: 2 }).toISOString(),
    status: faker.helpers.arrayElement(["active", "active", "active", "inactive", "pending"]),
    avatar_url: generateAvatarUrl(fullName, gender),
  }

  // Add role-specific properties
  if (role === "admin") {
    user.department = faker.helpers.arrayElement(adminDepartments)
  } else if (role === "teacher") {
    user.subject = faker.helpers.arrayElement(teacherSubjects)
  } else if (role === "student") {
    user.grade_level = faker.number.int({ min: 9, max: 12 })
  }

  // Add last active date for most users
  if (user.status !== "pending") {
    user.last_active = faker.date.recent({ days: 30 }).toISOString()
  }

  return user
}

// Generate a set of demo users
export const generateDemoUsers = (count = 50): DemoUser[] => {
  const users: DemoUser[] = []

  // Create a balanced distribution of roles
  const adminCount = Math.floor(count * 0.1) // 10% admins
  const teacherCount = Math.floor(count * 0.3) // 30% teachers
  const studentCount = count - adminCount - teacherCount // 60% students

  // Generate admins
  for (let i = 0; i < adminCount; i++) {
    users.push(generateDemoUser("admin", i))
  }

  // Generate teachers
  for (let i = 0; i < teacherCount; i++) {
    users.push(generateDemoUser("teacher", i))
  }

  // Generate students
  for (let i = 0; i < studentCount; i++) {
    users.push(generateDemoUser("student", i))
  }

  return users
}

// Get a smaller set of demo users for quick loading
export const getQuickDemoUsers = (): DemoUser[] => {
  return [
    generateDemoUser("admin", 0),
    generateDemoUser("admin", 1),
    generateDemoUser("teacher", 0),
    generateDemoUser("teacher", 1),
    generateDemoUser("teacher", 2),
    generateDemoUser("student", 0),
    generateDemoUser("student", 1),
    generateDemoUser("student", 2),
    generateDemoUser("student", 3),
    generateDemoUser("student", 4),
  ]
}
