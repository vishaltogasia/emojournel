import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 text-center px-4">
      <div className="mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-400 flex items-center justify-center mx-auto">
          <span className="text-white text-2xl">💜</span>
        </div>
        <h1 className="text-3xl font-bold mt-4 text-gray-800">EmoJournal</h1>
        <p className="text-gray-600 mt-1">Your emotional wellness companion</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
        <FeatureCard icon="💬" title="AI Chat" />
        <FeatureCard icon="📈" title="Mood Tracking" />
        <FeatureCard icon="💛" title="Wellness Tips" />
        <FeatureCard icon="🧑‍⚕️" title="Support" />
      </div>

      <Link href="/welcome">
        <Button className="bg-gradient-to-r from-purple-500 to-blue-400 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:opacity-90 transition">
          Start Your Journey
        </Button>
      </Link>

      <p className="mt-2 text-sm text-gray-500">Free to start • No commitment</p>
    </div>
  )
}

function FeatureCard({ icon, title }: { icon: string; title: string }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center justify-center flex-col">
        <span className="text-2xl">{icon}</span>
        <p className="mt-2 font-medium text-gray-700">{title}</p>
      </CardContent>
    </Card>
  )
}
