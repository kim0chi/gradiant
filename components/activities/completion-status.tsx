"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function CompletionStatus({ submissions }) {
  // Calculate completion status
  const calculateStatusData = () => {
    const statusCounts = {
      Submitted: submissions.filter((sub) => sub.status === "Submitted").length,
      Late: submissions.filter((sub) => sub.status === "Submitted" && sub.lateSubmission).length,
      Missing: submissions.filter((sub) => sub.status === "Missing").length,
    }

    return [
      {
        name: "Submission Status",
        "On Time": statusCounts["Submitted"] - statusCounts["Late"],
        Late: statusCounts["Late"],
        Missing: statusCounts["Missing"],
      },
    ]
  }

  const statusData = calculateStatusData()

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={statusData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="On Time" stackId="a" fill="#4ade80" />
          <Bar dataKey="Late" stackId="a" fill="#facc15" />
          <Bar dataKey="Missing" stackId="a" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

