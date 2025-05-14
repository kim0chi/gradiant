import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, CheckSquare, BarChart2, Calendar, Clock, Smartphone, MessageSquare } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function StudentPortalLanding() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-900 to-purple-700 py-20 px-4 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Your education journey, simplified</h1>
              <p className="text-xl text-purple-100">
                Access your grades, assignments, and attendance in one place. Stay on top of your academic progress with
                Gradiant's student portal.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-purple-700 hover:bg-purple-100">
                  <Link href="/student/login">Log In to Student Portal</Link>
                </Button>
                <Button asChild size="lg" className="bg-purple-600 text-white border border-white hover:bg-purple-800">
                  <Link href="/">Teacher Login</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 hidden md:block">
              <img
                src="/gradiant-student-illustration.png"
                alt="Students using digital tools"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Everything You Need to Succeed</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Gradiant's student portal gives you all the tools you need to stay organized, track your progress, and
            achieve your academic goals.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-purple-600" />}
              title="Track Your Grades"
              description="View your grades in real-time across all your classes. Monitor your progress and identify areas for improvement."
            />
            <FeatureCard
              icon={<CheckSquare className="h-10 w-10 text-purple-600" />}
              title="Manage Assignments"
              description="Keep track of upcoming assignments, due dates, and submission status. Never miss a deadline again."
            />
            <FeatureCard
              icon={<BarChart2 className="h-10 w-10 text-purple-600" />}
              title="Performance Analytics"
              description="Visualize your academic performance with intuitive charts and graphs. Understand your strengths and weaknesses."
            />
            <FeatureCard
              icon={<Calendar className="h-10 w-10 text-purple-600" />}
              title="Attendance Records"
              description="View your attendance history and ensure you're meeting attendance requirements for all your classes."
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-purple-600" />}
              title="Schedule Management"
              description="Access your class schedule, exam dates, and important academic events all in one place."
            />
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10 text-purple-600" />}
              title="Communication"
              description="Communicate with teachers and classmates directly through the platform for quick questions and clarifications."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Log In"
              description="Access your personalized student dashboard with your school credentials."
            />
            <StepCard
              number="2"
              title="Stay Updated"
              description="Check your grades, upcoming assignments, and attendance records in real-time."
            />
            <StepCard
              number="3"
              title="Succeed"
              description="Use insights from your data to improve your academic performance and achieve your goals."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">What Students Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Gradiant has completely changed how I manage my schoolwork. I can see all my assignments and grades in one place, which helps me stay organized."
              name="Alex Johnson"
              role="10th Grade Student"
            />
            <TestimonialCard
              quote="I love being able to check my grades right after tests. The performance analytics help me understand where I need to focus my studying."
              name="Maya Patel"
              role="11th Grade Student"
            />
            <TestimonialCard
              quote="The mobile app is amazing! I can check my schedule and assignments between classes without having to carry around a planner."
              name="Jamal Williams"
              role="9th Grade Student"
            />
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-20 px-4 bg-purple-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 order-2 md:order-1">
              <img
                src="/gradiant-student-cta.png"
                alt="Gradiant mobile app"
                className="mx-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="flex-1 space-y-6 order-1 md:order-2">
              <h2 className="text-3xl font-bold">Take Gradiant Anywhere</h2>
              <p className="text-lg">
                Access your student portal on the go with our mobile app. Check grades, assignments, and schedules from
                anywhere, anytime.
              </p>
              <div className="flex items-center gap-4">
                <Smartphone className="h-12 w-12 text-purple-600" />
                <div>
                  <h3 className="font-bold">Mobile App</h3>
                  <p className="text-muted-foreground">Available for iOS and Android</p>
                </div>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">Download App</Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-700 py-16 px-4 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to take control of your education?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of students who are using Gradiant to stay organized and improve their academic performance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-purple-700 hover:bg-purple-100">
              <Link href="/student/login">Log In to Student Portal</Link>
            </Button>
            <Button asChild size="lg" className="bg-purple-600 text-white border border-white hover:bg-purple-800">
              <Link href="/app/">Teacher Login</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// Helper Components
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) => (
  <Card className="h-full">
    <CardHeader>
      <div className="mb-4">{icon}</div>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
)

const StepCard = ({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) => (
  <div className="bg-white p-8 rounded-xl shadow-md relative">
    <div className="absolute top-4 right-4 bg-purple-100 text-purple-700 w-8 h-8 rounded-full flex items-center justify-center font-bold">
      {number}
    </div>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
)

const TestimonialCard = ({
  quote,
  name,
  role,
}: {
  quote: string
  name: string
  role: string
}) => (
  <Card className="h-full">
    <CardContent className="pt-6">
      <div className="mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-purple-400"
        >
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
        </svg>
      </div>
      <p className="mb-4 italic">{quote}</p>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </CardContent>
  </Card>
)