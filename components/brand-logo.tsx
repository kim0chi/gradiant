import Link from "next/link"

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center space-x-4 ${className}`}
    >
      {/* 1. The corner-turning stripes */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 4 stripes, each 8px thick, rounding the corner */}
        <path
          d="M0 40 H40 V0"
          stroke="#4F8A80"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M0 36 H36 V0"
          stroke="#A14B2D"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M0 32 H32 V0"
          stroke="#D14A2A"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M0 28 H28 V0"
          stroke="#E0B84A"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>

      {/* 2. The wordmark + tagline */}
      <div className="flex flex-col leading-tight">
        <span
          className="text-2xl font-bold"
          style={{ fontFamily: "Georgia, serif", color: "#4F8A80" }}
        >
          Gradiant
        </span>
        <span
          className="text-xs uppercase tracking-widest"
          style={{ fontFamily: "Georgia, serif", color: "#4F8A80" }}
        >
          Where Grade Meets Insight
        </span>
      </div>
    </Link>
  )
}
