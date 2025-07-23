import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
        <span className="text-white text-2xl">💜</span>
      </div>

      <h2 className="text-2xl font-bold mt-6 text-gray-800">Welcome to EmoJournal</h2>
      <p className="mt-2 text-gray-600 max-w-md">
        A safe space to explore and understand your emotions through AI-powered conversations.
      </p>

      <div className="bg-purple-100 text-purple-700 mt-4 p-3 rounded-lg text-sm max-w-md">
        <strong>Your privacy matters:</strong> All conversations are encrypted and never shared without your consent.
      </div>

      <Link href="/auth/register">
        <Button className="mt-6 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-full transition">
          Continue →
        </Button>
      </Link>
    </div>
  )
}
