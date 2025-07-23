"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface WeeklyInsightsProps {
  userId: string
}

interface Insight {
  type: "positive" | "neutral" | "concern"
  title: string
  description: string
}

export default function WeeklyInsights({ userId }: WeeklyInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    generateInsights()
  }, [userId])

  const generateInsights = async () => {
    try {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { data: entries } = await supabase
        .from("journal_entries")
        .select("mood_score, emotion_data, created_at")
        .eq("user_id", userId)
        .gte("created_at", sevenDaysAgo.toISOString())

      if (entries && entries.length > 0) {
        const generatedInsights: Insight[] = []

        // Analyze mood trends
        const moodScores = entries.filter((e) => e.mood_score).map((e) => e.mood_score!)
        if (moodScores.length > 0) {
          const avgMood = moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length

          if (avgMood >= 7) {
            generatedInsights.push({
              type: "positive",
              title: "Great Week!",
              description: `Your average mood this week was ${avgMood.toFixed(1)}/10. You're doing well!`,
            })
          } else if (avgMood < 4) {
            generatedInsights.push({
              type: "concern",
              title: "Challenging Week",
              description: `Your mood has been lower than usual. Consider reaching out for support.`,
            })
          }
        }

        // Analyze journaling consistency
        if (entries.length >= 5) {
          generatedInsights.push({
            type: "positive",
            title: "Consistent Journaling",
            description: `You've been journaling regularly with ${entries.length} entries this week. Great habit!`,
          })
        } else if (entries.length < 3) {
          generatedInsights.push({
            type: "neutral",
            title: "Journal More Often",
            description: "Try to journal more frequently to better track your emotional patterns.",
          })
        }

        // Analyze dominant emotions
        const emotions = entries
          .filter((e) => e.emotion_data?.dominant_emotion)
          .map((e) => e.emotion_data.dominant_emotion)

        if (emotions.length > 0) {
          const emotionCounts = emotions.reduce((acc: { [key: string]: number }, emotion) => {
            acc[emotion] = (acc[emotion] || 0) + 1
            return acc
          }, {})

          const dominantEmotion = Object.entries(emotionCounts).sort(([, a], [, b]) => b - a)[0][0]

          generatedInsights.push({
            type: "neutral",
            title: "Dominant Emotion",
            description: `${dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1)} was your most frequent emotion this week.`,
          })
        }

        setInsights(generatedInsights)
      }
    } catch (error) {
      console.error("Error generating insights:", error)
    } finally {
      setLoading(false)
    }
  }

  const getBadgeVariant = (type: Insight["type"]) => {
    switch (type) {
      case "positive":
        return "default"
      case "concern":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Insights</CardTitle>
        <CardDescription>AI-generated insights from your journaling patterns</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-gray-500">Generating insights...</div>
        ) : insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Badge variant={getBadgeVariant(insight.type)} className="mt-1">
                  {insight.type === "positive" ? "✨" : insight.type === "concern" ? "⚠️" : "ℹ️"}
                </Badge>
                <div>
                  <h4 className="font-medium text-gray-800">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">Journal more this week to get personalized insights!</div>
        )}
      </CardContent>
    </Card>
  )
}
