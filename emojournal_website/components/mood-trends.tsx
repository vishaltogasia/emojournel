"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MoodTrendsProps {
  userId: string
}

interface Entry {
  id: string
  mood_score?: number
  created_at: string
  username: string
}

export default function MoodTrends({ userId }: MoodTrendsProps) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [averageMood, setAverageMood] = useState(0)
  const [trend, setTrend] = useState(0)

  useEffect(() => {
    // Get mood data for the last 7 days from localStorage
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const storedEntries = JSON.parse(localStorage.getItem("emojournal_entries") || "[]")
    const userEntries = storedEntries.filter((entry: Entry) => 
      entry.username === userId && 
      entry.mood_score && 
      new Date(entry.created_at) >= sevenDaysAgo
    )
    
    // Sort by date
    userEntries.sort((a: Entry, b: Entry) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    
    setEntries(userEntries)

    // Calculate average mood
    const avg = userEntries.length > 0
      ? userEntries.reduce((sum: number, entry: Entry) => sum + (entry.mood_score || 0), 0) / userEntries.length
      : 0
    setAverageMood(avg)

    // Calculate trend
    const trendValue = userEntries.length >= 2 
      ? (userEntries[userEntries.length - 1].mood_score || 0) - (userEntries[0].mood_score || 0)
      : 0
    setTrend(trendValue)
  }, [userId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Trends</CardTitle>
        <CardDescription>Your emotional patterns this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Average Mood</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                  style={{ width: `${(averageMood / 10) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold">{averageMood.toFixed(1)}/10</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Weekly Trend</span>
            <div className="flex items-center space-x-1">
              {trend > 0 ? (
                <>
                  <span className="text-green-600 text-sm">↗</span>
                  <span className="text-green-600 text-sm font-semibold">Improving</span>
                </>
              ) : trend < 0 ? (
                <>
                  <span className="text-orange-600 text-sm">↘</span>
                  <span className="text-orange-600 text-sm font-semibold">Declining</span>
                </>
              ) : (
                <>
                  <span className="text-gray-600 text-sm">→</span>
                  <span className="text-gray-600 text-sm font-semibold">Stable</span>
                </>
              )}
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs text-gray-500">Based on {entries?.length || 0} entries this week</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
