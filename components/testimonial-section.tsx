import Image from "next/image"

import { Card, CardContent, CardFooter } from "@/components/ui/card"

const testimonials = [
  {
    quote:
      "Gradiant has completely transformed how I manage my classroom. The grade analytics and performance tracking save me hours every week.",
    author: "Sarah Johnson",
    role: "High School Math Teacher",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "The attendance tracking and reporting features are exceptional. I can easily identify patterns and address issues with students proactively.",
    author: "Michael Chen",
    role: "University Professor",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "As a department head, the data analytics have been invaluable for identifying trends across multiple classes and improving our curriculum.",
    author: "Emma Rodriguez",
    role: "Department Chair, Science",
    avatar: "/placeholder.svg?height=80&width=80",
  },
]

export function TestimonialSection() {
  return (
    <section id="testimonials" className="relative py-20 md:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-100 via-white to-white dark:from-blue-950 dark:via-gray-900 dark:to-gray-900"></div>
      <div className="container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Trusted by educators worldwide</h2>
          <p className="text-lg text-muted-foreground">
            Hear what teachers and administrators have to say about Gradiant.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardContent className="pt-6">
                <p className="mb-4 text-lg italic">"{testimonial.quote}"</p>
              </CardContent>
              <CardFooter className="flex items-center gap-4">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

