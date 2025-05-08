import * as z from "zod"

// Category Schema
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  weight: z.number(),
})

export type Category = z.infer<typeof CategorySchema>

// Period Schema
export const PeriodSchema = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  weight: z.number(),
})

export type Period = z.infer<typeof PeriodSchema>

// Task Schema
export const TaskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  categoryId: z.string().min(1),
  maxPoints: z.number().min(1),
  dueDate: z.string().nullable(),
  description: z.string().optional(),
  periodId: z.string().min(1),
})

export type Task = z.infer<typeof TaskSchema>

// Grade Schema
export const GradeSchema = z.object({
  studentId: z.string(),
  taskId: z.string(),
  score: z.number().nullable(),
  feedback: z.string().optional(),
  submissionDate: z.string().optional(),
})

export type Grade = z.infer<typeof GradeSchema>

// Class Settings Schema
export const ClassSettingsSchema = z.object({
  calculationMode: z.enum(["weighted", "summary"]),
})

export type ClassSettings = z.infer<typeof ClassSettingsSchema>

// Student Schema
export const StudentSchema = z.object({
  studentId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  status: z.enum(["active", "inactive", "transferred"]),
})

export type Student = z.infer<typeof StudentSchema>

// Analytics Response Schema
export const AnalyticsResponseSchema = z.object({
  periodAverages: z.array(
    z.object({
      periodId: z.string(),
      periodName: z.string(),
      average: z.number(),
      letterGrade: z.string(),
    }),
  ),
  finalAverage: z.object({
    score: z.number(),
    letterGrade: z.string(),
  }),
  studentPerformance: z.array(
    z.object({
      studentId: z.string(),
      studentName: z.string(),
      periodAverages: z.array(
        z.object({
          periodId: z.string(),
          average: z.number(),
        }),
      ),
      finalAverage: z.number(),
    }),
  ),
})

export type AnalyticsResponse = z.infer<typeof AnalyticsResponseSchema>

// Grade Summary Schema
export const GradeSummarySchema = z.object({
  studentId: z.string(),
  studentName: z.string(),
  periodGrades: z.object({
    prelims: z.number(),
    midterms: z.number(),
    semis: z.number(),
    finals: z.number(),
  }),
  finalAverage: z.number(),
})

export type GradeSummaryItem = z.infer<typeof GradeSummarySchema>

// Grade Summary Response Schema
export const GradeSummaryResponseSchema = z.array(GradeSummarySchema)

export type GradeSummaryResponse = z.infer<typeof GradeSummaryResponseSchema>
