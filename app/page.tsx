import { Button } from "@/components/ui/button"
import type React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  BarChart2,
  Calendar,
  Clock,
  ListChecks,
  PenTool,
  Smartphone,
  TrendingUp,
  UserCheck,
  Users,
  Wifi,
} from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-900 to-indigo-700 py-20 px-4 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Empower teachers with real-time insights
              </h1>
              <p className="text-xl text-indigo-100">
                Gradiant is a progressive web app for educators that streamlines grading, attendance tracking, and
                data-driven analytics.
              </p>
              <div className="pt-4">
                <Button asChild size="lg" className="bg-white text-indigo-700 hover:bg-indigo-100">
                  <Link href="/login">Get Started</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <Image
                src="/placeholder.svg?key=jhfoi"
                alt="Teacher with analytics dashboard"
                width={500}
                height={500}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Feature List */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureItem icon={<PenTool className="w-5 h-5" />} title="Real-time grade input" />
            <FeatureItem icon={<BarChart2 className="w-5 h-5" />} title="Automated analytics & visualizations" />
            <FeatureItem icon={<Users className="w-5 h-5" />} title="Student clustering & segmentation" />
            <FeatureItem icon={<UserCheck className="w-5 h-5" />} title="Attendance tracking & management" />
            <FeatureItem icon={<Wifi className="w-5 h-5" />} title="Offline PWA support & fast load times" />
            <FeatureItem icon={<Smartphone className="w-5 h-5" />} title="Mobile student dashboard" />
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<PenTool className="w-12 h-12 text-indigo-600" />}
              title="Real-time Grade Input"
              description="Enter grades quickly with our intuitive interface. Supports custom grading scales and automatic calculations."
            />

            <FeatureCard
              icon={<BarChart2 className="w-12 h-12 text-indigo-600" />}
              title="Automated Analytics"
              description="Gain valuable insights with automated analytics and visualizations. Identify trends and areas for improvement."
            />

            <FeatureCard
              icon={<Users className="w-12 h-12 text-indigo-600" />}
              title="Student Clustering"
              description="Group students by performance metrics to personalize teaching strategies and interventions."
            />

            <FeatureCard
              icon={<Calendar className="w-12 h-12 text-indigo-600" />}
              title="Attendance Tracking"
              description="Easily record and manage student attendance with flexible options for present, absent, or tardy."
            />

            <FeatureCard
              icon={<Wifi className="w-12 h-12 text-indigo-600" />}
              title="Offline PWA Support"
              description="Work anywhere with our offline-capable Progressive Web App. Your data syncs when you're back online."
            />

            <FeatureCard
              icon={<Smartphone className="w-12 h-12 text-indigo-600" />}
              title="Mobile Student Dashboard"
              description="Students can view grades and attendance on their mobile devices with our responsive interface."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">How Gradiant Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Input Data"
              description="Teachers record grades and attendance in real-time using our intuitive interface."
              icon={<ListChecks className="w-8 h-8 text-indigo-600" />}
            />

            <StepCard
              number="2"
              title="Analyze Results"
              description="Our system automatically generates insights and visualizations from your data."
              icon={<TrendingUp className="w-8 h-8 text-indigo-600" />}
            />

            <StepCard
              number="3"
              title="Take Action"
              description="Use the insights to make data-driven decisions and improve student outcomes."
              icon={<Clock className="w-8 h-8 text-indigo-600" />}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-700 py-16 px-4 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your classroom?</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join thousands of educators who are using Gradiant to streamline their workflow and improve student
            outcomes.
          </p>
          <Button asChild size="lg" className="bg-white text-indigo-700 hover:bg-indigo-100">
            <Link href="/login">Get Started Today</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// Helper Components
const FeatureItem = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center space-x-2 bg-indigo-800/50 rounded-full py-2 px-4">
    {icon}
    <span>{title}</span>
  </div>
)

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) => (
  <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="mb-6">{icon}</div>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
)

const StepCard = ({
  number,
  title,
  description,
  icon,
}: {
  number: string
  title: string
  description: string
  icon: React.ReactNode
}) => (
  <div className="bg-gray-50 p-8 rounded-xl relative">
    <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center font-bold">
      {number}
    </div>
    <div className="mb-6">{icon}</div>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
)
