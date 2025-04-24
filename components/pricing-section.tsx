import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    name: "Starter",
    price: "$9",
    period: "/month per teacher",
    description: "Perfect for individual teachers and small classes.",
    features: [
      "Grade management for up to 100 students",
      "Basic attendance tracking",
      "Student information management",
      "PDF report generation",
      "Email support",
    ],
    cta: "Start free trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month per teacher",
    description: "Ideal for schools and departments with advanced needs.",
    features: [
      "Grade management for unlimited students",
      "Advanced attendance tracking",
      "Complete student analytics",
      "Class & schedule management",
      "Data analytics & performance forecasting",
      "Student clustering & segmentation",
      "Custom report generation",
      "LMS integration",
      "Priority support",
    ],
    cta: "Start free trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large educational institutions with specific requirements.",
    features: [
      "All Professional features",
      "Dedicated account manager",
      "Custom integrations",
      "API access",
      "Advanced security features",
      "On-premise deployment option",
      "Training and onboarding",
      "24/7 support",
    ],
    cta: "Contact sales",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that's right for your educational institution.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular ? "border-2 border-cyan-500 shadow-lg dark:border-cyan-400" : "border shadow"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-1 text-sm font-medium text-white">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.name === "Enterprise" ? "/contact" : "/signup"}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

