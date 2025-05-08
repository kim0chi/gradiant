import type { MetadataRoute } from "next"

// This provides the Web App Manifest file for PWA functionality
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gradiant - Education Analytics",
    short_name: "Gradiant",
    description: "PWA for grading, attendance, and analytics",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
