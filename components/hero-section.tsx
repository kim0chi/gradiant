import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-white dark:from-blue-950 dark:via-gray-900 dark:to-gray-900"></div>
      <div className="container relative">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Simplify grading and</span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                empower educators
              </span>
            </h1>
            <p className="mb-10 text-lg text-muted-foreground md:text-xl">
              Gradiant streamlines student grading, performance tracking, and classroom management with powerful
              analytics and intuitive tools.
            </p>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                asChild
              >
                <Link href="/signup">
                  Start free trial
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Explore features</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-500"></div>
                <div className="h-8 w-8 rounded-full bg-purple-500"></div>
                <div className="h-8 w-8 rounded-full bg-indigo-500"></div>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">5,000+</span> educators trust Gradiant
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="relative mx-auto overflow-hidden rounded-xl border shadow-2xl">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Gradiant dashboard preview"
                width={800}
                height={600}
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 backdrop-blur-[1px]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-lg bg-white/90 p-4 shadow-lg dark:bg-gray-800/90">
                  <h3 className="mb-2 text-lg font-medium">Grade Analytics Dashboard</h3>
                  <p className="text-sm text-muted-foreground">Real-time insights into student performance</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 opacity-80 blur-2xl"></div>
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 opacity-80 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

