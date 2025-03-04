"use client"

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Netflix", value: 15.99 },
  { name: "Spotify", value: 9.99 },
  { name: "Adobe CC", value: 52.99 },
  { name: "Others", value: 25.03 },
]

export function SubscriptionOverview() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie dataKey="value" data={data} fill="#8884d8" label />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

