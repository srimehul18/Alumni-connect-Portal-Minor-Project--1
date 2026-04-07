"use client"

import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface AnalyticsChartsProps {
  data: any[]
  type: "registrations" | "distribution"
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--muted-foreground))"]

export function AnalyticsCharts({ data, type }: AnalyticsChartsProps) {
  if (type === "registrations") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Bar dataKey="students" name="Students" fill="hsl(0, 80%, 50%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="alumni" name="Alumni" fill="hsl(240, 100%, 50%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((_, index) => (
        <Cell key={`cell-${index}`} fill={index === 0 ? "orange" : "green"} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
        backgroundColor: "hsl(0, 0%, 100%)",
        border: "1px solid hsl(0, 0%, 0%)",
        borderRadius: "8px",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
