"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RecentEntriesProps {
  userId: string
}

interface Entry {
  id: string
  content: string
  emotion_data?: any
  mood_score?: number
  created_at: string
  username: string
}

export default function RecentEntries({ userId }: RecentEntriesProps) {
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    // Get entries from localStorage
    const storedEntries = JSON.parse(localStorage.getItem("emojournal_entries") || "[]")
    const userEntries = storedEntries.filter((entry: Entry) => entry.username === userId)
    setEntries(userEntries.slice(0, 5)) // Get latest 5 entries
  }, [userId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Entries</CardTitle>
        <CardDescription>Your latest journal reflections</CardDescription>
      </CardHeader>
      <CardContent>
        {entries && entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="border-l-4 border-purple-200 pl-4">
                <p className="text-sm text-gray-700 line-clamp-2">{entry.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    {entry.emotion_data?.dominant_emotion && (
                      <Badge className="text-xs bg-purple-100 text-purple-800">
                        {entry.emotion_data.dominant_emotion}
                      </Badge>
                    )}
                    {entry.mood_score && (
                      <Badge className="text-xs border border-gray-300 bg-transparent">
                        Mood: {entry.mood_score}/10
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{new Date(entry.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No entries yet. Start your first journal session!</p>
        )}
      </CardContent>
    </Card>
  )
}
