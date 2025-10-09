// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { Heart } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { useAuth } from "@/hooks/use-auth"
// import { useToast } from "@/hooks/use-toast"

// export default function LoginPage() {
//   const router = useRouter()
//   const { login, isLoading } = useAuth()
//   const { toast } = useToast()
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   })

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     try {
//       const user = await login(formData.email, formData.password)

//       toast({
//         title: "Login successful",
//         description: `Welcome back, ${user.name}!`,
//       })

//       // Redirect based on user role
//       if (user.role === "farmer") {
//         router.push("/dashboard/farmer")
//       } else if (user.role === "veterinarian") {
//         router.push("/dashboard/veterinarian")
//       } else if (user.role === "admin") {
//         router.push("/dashboard/admin")
//       }
//     } catch (error) {
//       toast({
//         title: "Login failed",
//         description: error instanceof Error ? error.message : "Invalid credentials",
//         variant: "destructive",
//       })
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="w-full max-w-md">
//         <div className="flex justify-center mb-8">
//           <Link href="/" className="flex items-center gap-2">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
//               <Heart className="h-6 w-6 text-white" />
//             </div>
//             <span className="text-xl font-bold">VetConnect Rwanda</span>
//           </Link>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Sign In</CardTitle>
//             <CardDescription>Enter your credentials to access your account</CardDescription>
//           </CardHeader>
//           <form onSubmit={handleSubmit}>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="you@example.com"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="••••••••"
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="flex items-center justify-between">
//                 <Link href="/forgot-password" className="text-sm text-green-600 hover:underline">
//                   Forgot password?
//                 </Link>
//               </div>
//             </CardContent>
//             <CardFooter className="flex flex-col gap-4">
//               <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
//                 {isLoading ? "Signing in..." : "Sign In"}
//               </Button>
//               <p className="text-sm text-center text-gray-600">
//                 Don't have an account?{" "}
//                 <Link href="/register" className="text-green-600 hover:underline font-medium">
//                   Sign up
//                 </Link>
//               </p>
//             </CardFooter>
//           </form>
//         </Card>
//       </div>
//     </div>
//   )
// }
