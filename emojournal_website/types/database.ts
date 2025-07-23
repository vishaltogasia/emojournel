export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          age_range: string | null
          primary_goals: string[] | null
          notification_preferences: any | null
          privacy_settings: any | null
          subscription_tier: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          age_range?: string | null
          primary_goals?: string[] | null
          notification_preferences?: any | null
          privacy_settings?: any | null
          subscription_tier?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          age_range?: string | null
          primary_goals?: string[] | null
          notification_preferences?: any | null
          privacy_settings?: any | null
          subscription_tier?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          content: string
          emotion_data: any | null
          mood_score: number | null
          context_tags: string[] | null
          session_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          emotion_data?: any | null
          mood_score?: number | null
          context_tags?: string[] | null
          session_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          emotion_data?: any | null
          mood_score?: number | null
          context_tags?: string[] | null
          session_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          title: string | null
          dominant_emotion: string | null
          emotion_summary: any | null
          session_duration: number | null
          message_count: number | null
          started_at: string
          ended_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          dominant_emotion?: string | null
          emotion_summary?: any | null
          session_duration?: number | null
          message_count?: number | null
          started_at?: string
          ended_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          dominant_emotion?: string | null
          emotion_summary?: any | null
          session_duration?: number | null
          message_count?: number | null
          started_at?: string
          ended_at?: string | null
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          user_id: string
          content: string
          message_type: string
          emotion_analysis: any | null
          confidence_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          content: string
          message_type: string
          emotion_analysis?: any | null
          confidence_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          content?: string
          message_type?: string
          emotion_analysis?: any | null
          confidence_score?: number | null
          created_at?: string
        }
      }
      emotions: {
        Row: {
          id: number
          name: string
          category: string | null
          color_code: string | null
          description: string | null
        }
        Insert: {
          id?: number
          name: string
          category?: string | null
          color_code?: string | null
          description?: string | null
        }
        Update: {
          id?: number
          name?: string
          category?: string | null
          color_code?: string | null
          description?: string | null
        }
      }
      user_emotions: {
        Row: {
          id: string
          user_id: string
          date: string
          emotions: any
          dominant_emotion: string | null
          average_mood_score: number | null
          entry_count: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          emotions: any
          dominant_emotion?: string | null
          average_mood_score?: number | null
          entry_count?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          emotions?: any
          dominant_emotion?: string | null
          average_mood_score?: number | null
          entry_count?: number | null
          created_at?: string
        }
      }
    }
  }
}
