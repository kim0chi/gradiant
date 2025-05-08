import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useProfile } from "@/contexts/profile-context"

interface ProfileAvatarProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function ProfileAvatar({ size = "md", className = "" }: ProfileAvatarProps) {
  const { profile } = useProfile()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Determine size class
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-20 w-20",
  }

  const sizeClass = sizeClasses[size] || sizeClasses.md

  return (
    <Avatar className={`${sizeClass} ${className}`}>
      {profile?.avatar_url && (
        <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.full_name || "User"} />
      )}
      <AvatarFallback>{profile?.full_name ? getInitials(profile.full_name) : "U"}</AvatarFallback>
    </Avatar>
  )
}
