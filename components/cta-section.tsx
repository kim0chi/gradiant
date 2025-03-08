import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 p-8 text-center text-white md:p-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Ready to transform your classroom?</h2>
          <p className="mb-8 text-lg opacity-90">
            Join thousands of educators who are streamlining their grading and empowering student success with Gradiant.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
            <Link href="/signup">
              Start your free 14-day trial
              <ArrowRight className="ml-1.5 h-5 w-5" />
            </Link>
          </Button>
          <p className="mt-4 text-sm opacity-80">No credit card required. Cancel anytime.</p>
        </div>
      </div>
    </section>
  )
}

