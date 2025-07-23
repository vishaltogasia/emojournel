"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface EmotionDistributionProps {
  userId: string
}

interface EmotionData {
  name: string
  value: number
  color: string
}

const EMOTION_COLORS = {
  joy: "#10b981",
  sadness: "#3b82f6",
  anxiety: "#f59e0b",
  anger: "#ef4444",
  fear: "#8b5cf6",
  neutral: "#6b7280",
  love: "#ec4899",
  surprise: "#06b6d4",
  disgust: "#84cc16",
  default: "#9ca3af",
}

export default function EmotionDistribution({ userId }: EmotionDistributionProps) {
  const [data, setData] = useState<EmotionData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchEmotionData()
  }, [userId])

  const fetchEmotionData = async () => {
    try {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: entries } = await supabase
        .from("journal_entries")
        .select("emotion_data")
        .eq("user_id", userId)
        .gte("created_at", thirtyDaysAgo.toISOString())
        .not("emotion_data", "is", null)

      if (entries) {
        const emotionCounts: { [key: string]: number } = {}

        entries.forEach((entry) => {
          if (entry.emotion_data?.dominant_emotion) {
            const emotion = entry.emotion_data.dominant_emotion.toLowerCase()
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
          }
        })

        const chartData = Object.entries(emotionCounts).map(([emotion, count]) => ({
          name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
          value: count,
          color: EMOTION_COLORS[emotion as keyof typeof EMOTION_COLORS] || EMOTION_COLORS.default,
        }))

        setData(chartData)
      }
    } catch (error) {
      console.error("Error fetching emotion data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emotion Distribution</CardTitle>
        <CardDescription>Your emotional patterns over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-500">Loading chart...</div>
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-500">No emotion data available yet</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
