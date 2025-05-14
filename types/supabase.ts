export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: "admin" | "teacher" | "student"
          created_at: string
          updated_at: string
          // Remove avatar_url field since it doesn't exist in the database
          password_changed_at: string | null
          institutional: boolean | null
          school_id: string | null
          grade_level: number | null // For students
          subject_area: string | null // For teachers
          bio: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role: "admin" | "teacher" | "student"
          created_at?: string
          updated_at?: string
          // Remove avatar_url field
          password_changed_at?: string | null
          institutional?: boolean | null
          school_id?: string | null
          grade_level?: number | null
          subject_area?: string | null
          bio?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: "admin" | "teacher" | "student"
          created_at?: string
          updated_at?: string
          // Remove avatar_url field
          password_changed_at?: string | null
          institutional?: boolean | null
          school_id?: string | null
          grade_level?: number | null
          subject_area?: string | null
          bio?: string | null
        }
      }
      // Other tables remain unchanged
      classes: {
        Row: {
          id: string
          teacher_id: string
          name: string
          subject: string
          grade_level: number
          period: number | null
          school_year: string
          created_at: string
          updated_at: string
          description: string | null
          schedule: Json | null
          room: string | null
        }
        Insert: {
          id?: string
          teacher_id: string
          name: string
          subject: string
          grade_level: number
          period?: number | null
          school_year: string
          created_at?: string
          updated_at?: string
          description?: string | null
          schedule?: Json | null
          room?: string | null
        }
        Update: {
          id?: string
          teacher_id?: string
          name?: string
          subject?: string
          grade_level?: number
          period?: number | null
          school_year?: string
          created_at?: string
          updated_at?: string
          description?: string | null
          schedule?: Json | null
          room?: string | null
        }
      }
      class_students: {
        Row: {
          id: string
          class_id: string
          student_id: string
          created_at: string
          updated_at: string
          status: "active" | "inactive" | "pending"
        }
        Insert: {
          id?: string
          class_id: string
          student_id: string
          created_at?: string
          updated_at?: string
          status?: "active" | "inactive" | "pending"
        }
        Update: {
          id?: string
          class_id?: string
          student_id?: string
          created_at?: string
          updated_at?: string
          status?: "active" | "inactive" | "pending"
        }
      }
      tasks: {
        Row: {
          id: string
          class_id: string
          title: string
          description: string | null
          due_date: string
          points_possible: number
          category_id: string | null
          created_at: string
          updated_at: string
          visible_to_students: boolean
          type: "assignment" | "quiz" | "test" | "project" | "participation" | "other"
        }
        Insert: {
          id?: string
          class_id: string
          title: string
          description?: string | null
          due_date: string
          points_possible: number
          category_id?: string | null
          created_at?: string
          updated_at?: string
          visible_to_students?: boolean
          type?: "assignment" | "quiz" | "test" | "project" | "participation" | "other"
        }
        Update: {
          id?: string
          class_id?: string
          title?: string
          description?: string | null
          due_date?: string
          points_possible?: number
          category_id?: string | null
          created_at?: string
          updated_at?: string
          visible_to_students?: boolean
          type?: "assignment" | "quiz" | "test" | "project" | "participation" | "other"
        }
      }
      grades: {
        Row: {
          id: string
          task_id: string
          student_id: string
          points_earned: number
          submitted_at: string | null
          graded_at: string | null
          feedback: string | null
          created_at: string
          updated_at: string
          status: "pending" | "submitted" | "graded" | "excused" | "missing"
        }
        Insert: {
          id?: string
          task_id: string
          student_id: string
          points_earned: number
          submitted_at?: string | null
          graded_at?: string | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
          status?: "pending" | "submitted" | "graded" | "excused" | "missing"
        }
        Update: {
          id?: string
          task_id?: string
          student_id?: string
          points_earned?: number
          submitted_at?: string | null
          graded_at?: string | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
          status?: "pending" | "submitted" | "graded" | "excused" | "missing"
        }
      }
      attendance: {
        Row: {
          id: string
          class_id: string
          student_id: string
          date: string
          status: "present" | "absent" | "tardy" | "excused"
          created_at: string
          updated_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          class_id: string
          student_id: string
          date: string
          status: "present" | "absent" | "tardy" | "excused"
          created_at?: string
          updated_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          class_id?: string
          student_id?: string
          date?: string
          status?: "present" | "absent" | "tardy" | "excused"
          created_at?: string
          updated_at?: string
          notes?: string | null
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          settings_data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          settings_data: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          settings_data?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
