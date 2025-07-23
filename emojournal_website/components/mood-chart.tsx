"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface MoodChartProps {
  userId: string
}

interface MoodData {
  date: string
  mood: number
}

export default function MoodChart({ userId }: MoodChartProps) {
  const [data, setData] = useState<MoodData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchMoodData()
  }, [userId])

  const fetchMoodData = async () => {
    try {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: entries } = await supabase
        .from("journal_entries")
        .select("mood_score, created_at")
        .eq("user_id", userId)
        .gte("created_at", thirtyDaysAgo.toISOString())
        .not("mood_score", "is", null)
        .order("created_at", { ascending: true })

      if (entries) {
        // Group by date and calculate average mood per day
        const groupedData = entries.reduce((acc: { [key: string]: number[] }, entry) => {
          const date = new Date(entry.created_at).toLocaleDateString()
          if (!acc[date]) acc[date] = []
          acc[date].push(entry.mood_score!)
          return acc
        }, {})

        const chartData = Object.entries(groupedData).map(([date, moods]) => ({
          date,
          mood: moods.reduce((sum, mood) => sum + mood, 0) / moods.length,
        }))

        setData(chartData)
      }
    } catch (error) {
      console.error("Error fetching mood data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Trends</CardTitle>
        <CardDescription>Your mood patterns over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-500">Loading chart...</div>
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString([], { month: "short", day: "numeric" })}
              />
              <YAxis domain={[1, 10]} tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number) => [`${value.toFixed(1)}/10`, "Mood Score"]}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="url(#colorGradient)"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-500">No mood data available yet</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
