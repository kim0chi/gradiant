"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, Home, Calendar, School, BookOpen, Save, Edit, Sun, Moon, Monitor } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import AppLayout from "@/components/layout/app-layout"

export default function StudentProfilePage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [studentData, setStudentData] = useState({
    fullName: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567",
    address: "123 Campus Drive, College Town, CT 12345",
    birthDate: "2005-08-15",
    gradeLevel: "10th Grade",
    studentId: "STU-24601",
    bio: "I'm a sophomore interested in mathematics and computer science. I'm on the debate team and play basketball.",
    notifications: {
      grades: true,
      assignments: true,
      attendance: false,
      announcements: true,
    },
  })

  const handleSaveProfile = () => {
    // In a real app, this would save to the database
    setIsEditing(false)
    // Show success message
    alert("Profile updated successfully!")
  }

  return (
    <AppLayout userRole="student">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Student Profile</h1>
            <p className="text-muted-foreground">View and manage your profile information</p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="academic">Academic Information</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Your profile picture and basic info</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                      {studentData.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">{studentData.fullName}</h3>
                  <p className="text-muted-foreground">{studentData.studentId}</p>
                  <p className="text-muted-foreground">{studentData.gradeLevel}</p>
                  <Button variant="outline" className="mt-4 w-full">
                    Change Picture
                  </Button>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="fullName"
                            value={studentData.fullName}
                            onChange={(e) => setStudentData({ ...studentData, fullName: e.target.value })}
                          />
                        ) : (
                          <p>{studentData.fullName}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={studentData.email}
                            onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                          />
                        ) : (
                          <p>{studentData.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={studentData.phone}
                            onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
                          />
                        ) : (
                          <p>{studentData.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Birth Date</Label>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="birthDate"
                            type="date"
                            value={studentData.birthDate}
                            onChange={(e) => setStudentData({ ...studentData, birthDate: e.target.value })}
                          />
                        ) : (
                          <p>{new Date(studentData.birthDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="flex items-center">
                      <Home className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                      {isEditing ? (
                        <Input
                          id="address"
                          value={studentData.address}
                          onChange={(e) => setStudentData({ ...studentData, address: e.target.value })}
                        />
                      ) : (
                        <p>{studentData.address}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={studentData.bio}
                        onChange={(e) => setStudentData({ ...studentData, bio: e.target.value })}
                        rows={4}
                      />
                    ) : (
                      <p className="text-sm">{studentData.bio}</p>
                    )}
                  </div>
                </CardContent>
                {isEditing && (
                  <CardFooter>
                    <Button onClick={handleSaveProfile} className="ml-auto">
                      Save Changes
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academic">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                  <CardDescription>Your academic details and enrollment information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <div className="flex items-center">
                        <School className="mr-2 h-4 w-4 text-muted-foreground" />
                        <p>{studentData.studentId}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gradeLevel">Grade Level</Label>
                      <div className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="gradeLevel"
                            value={studentData.gradeLevel}
                            onChange={(e) => setStudentData({ ...studentData, gradeLevel: e.target.value })}
                          />
                        ) : (
                          <p>{studentData.gradeLevel}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Enrolled Classes</h3>
                    <div className="space-y-2">
                      <div className="p-3 rounded-md border">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Mathematics</h4>
                            <p className="text-sm text-muted-foreground">Algebra II - Room 203</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">87%</p>
                            <p className="text-sm text-muted-foreground">Ms. Johnson</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-md border">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Science</h4>
                            <p className="text-sm text-muted-foreground">Biology - Room 105</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">92%</p>
                            <p className="text-sm text-muted-foreground">Mr. Smith</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-md border">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">English</h4>
                            <p className="text-sm text-muted-foreground">Literature - Room 301</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">78%</p>
                            <p className="text-sm text-muted-foreground">Mrs. Davis</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-md border">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">History</h4>
                            <p className="text-sm text-muted-foreground">World History - Room 204</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">85%</p>
                            <p className="text-sm text-muted-foreground">Mr. Wilson</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Academic Performance</CardTitle>
                  <CardDescription>Your grades and academic achievements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Current GPA</h3>
                    <div className="flex items-center">
                      <div className="text-3xl font-bold">3.7</div>
                      <div className="ml-2 text-sm text-muted-foreground">out of 4.0</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Achievements</h3>
                    <div className="space-y-2">
                      <div className="p-3 rounded-md bg-primary/10">
                        <h4 className="font-medium">Honor Roll</h4>
                        <p className="text-sm">Fall Semester 2023</p>
                      </div>
                      <div className="p-3 rounded-md bg-primary/10">
                        <h4 className="font-medium">Science Fair Winner</h4>
                        <p className="text-sm">Regional Competition 2023</p>
                      </div>
                      <div className="p-3 rounded-md bg-primary/10">
                        <h4 className="font-medium">Perfect Attendance</h4>
                        <p className="text-sm">Spring Semester 2023</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Extracurricular Activities</h3>
                    <div className="space-y-2">
                      <div className="p-3 rounded-md border">
                        <h4 className="font-medium">Debate Team</h4>
                        <p className="text-sm text-muted-foreground">Member since 2022</p>
                      </div>
                      <div className="p-3 rounded-md border">
                        <h4 className="font-medium">Basketball Team</h4>
                        <p className="text-sm text-muted-foreground">Junior Varsity</p>
                      </div>
                      <div className="p-3 rounded-md border">
                        <h4 className="font-medium">Coding Club</h4>
                        <p className="text-sm text-muted-foreground">Vice President</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preferences">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="grades-notification">Grade Updates</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications when grades are updated</p>
                    </div>
                    <Switch
                      id="grades-notification"
                      checked={studentData.notifications.grades}
                      onCheckedChange={(checked) =>
                        setStudentData({
                          ...studentData,
                          notifications: { ...studentData.notifications, grades: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="assignments-notification">Assignment Reminders</Label>
                      <p className="text-sm text-muted-foreground">Receive reminders about upcoming assignments</p>
                    </div>
                    <Switch
                      id="assignments-notification"
                      checked={studentData.notifications.assignments}
                      onCheckedChange={(checked) =>
                        setStudentData({
                          ...studentData,
                          notifications: { ...studentData.notifications, assignments: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="attendance-notification">Attendance Updates</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications about attendance records</p>
                    </div>
                    <Switch
                      id="attendance-notification"
                      checked={studentData.notifications.attendance}
                      onCheckedChange={(checked) =>
                        setStudentData({
                          ...studentData,
                          notifications: { ...studentData.notifications, attendance: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="announcements-notification">School Announcements</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications about school announcements</p>
                    </div>
                    <Switch
                      id="announcements-notification"
                      checked={studentData.notifications.announcements}
                      onCheckedChange={(checked) =>
                        setStudentData({
                          ...studentData,
                          notifications: { ...studentData.notifications, announcements: checked },
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Display Preferences</CardTitle>
                  <CardDescription>Customize your display settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        className="flex flex-col items-center justify-center h-24 gap-2"
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="h-8 w-8" />
                        <span>Light</span>
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        className="flex flex-col items-center justify-center h-24 gap-2"
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="h-8 w-8" />
                        <span>Dark</span>
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "outline"}
                        className="flex flex-col items-center justify-center h-24 gap-2"
                        onClick={() => setTheme("system")}
                      >
                        <Monitor className="h-8 w-8" />
                        <span>System</span>
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Accessibility</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="font-size">Larger Font Size</Label>
                          <p className="text-sm text-muted-foreground">Increase the size of text throughout the app</p>
                        </div>
                        <Switch id="font-size" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="high-contrast">High Contrast</Label>
                          <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                        </div>
                        <Switch id="high-contrast" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="reduce-motion">Reduce Motion</Label>
                          <p className="text-sm text-muted-foreground">Minimize animations throughout the app</p>
                        </div>
                        <Switch id="reduce-motion" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
