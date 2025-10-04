"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { setAuthToken } from "@/lib/auth"
import { useNavigate } from "react-router-dom"
import { useAuthInit } from "@/hooks/useAuthInit"

type FormData = {
  email: string
  password: string
}

type Errors = {
  email?: string
  password?: string
}

const EntrepreneurAuthForm = () => {
  const { user } = useAuthInit();
  const navigate = useNavigate();


  useEffect(() => {
    if (user) {
      // console.log("User is already authenticated, redirecting to register device page.");
      navigate("/register-device");
    } 
  }, [user, navigate])


  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Errors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  
  const validateForm = () => {
    const newErrors: Errors = {}


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
    }

    return newErrors
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateForm()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      }, {
        headers: {
          'x-kiosk': 'true'
        }
      })
    
      if (!response.data) {
        setErrors({
          email: "Authentication failed. Please check your credentials.",
        })
      }
      console.log("Authentication response:", response.data)
      const { token, user } = response.data

      await setAuthToken(token, JSON.stringify(user));

      navigate("/register-device");
    } catch (error) {
      console.error("Authentication error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 inter-300">
      <div className="space-y-2">
        <div className="text-sm font-medium text-zinc-300 flex items-center gap-2">
          <Mail size={16} className="text-zinc-400" />
          <Label htmlFor="email">Email</Label>
        </div>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full pl-3 pr-3 py-2 bg-zinc-800 border ${
              errors.email ? "border-red-500" : "border-zinc-700"
            } rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200`}
            disabled={isLoading}
            aria-invalid={errors.email ? "true" : "false"}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-400 flex items-center gap-1 mt-1 animate-in fade-in duration-200">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-zinc-300 flex items-center gap-2">
          <Lock size={16} className="text-zinc-400" />
          <Label htmlFor="password">Password</Label>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full pl-3 pr-10 py-2 bg-zinc-800 border ${
              errors.password ? "border-red-500" : "border-zinc-700"
            } rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200`}
            disabled={isLoading}
            aria-invalid={errors.password ? "true" : "false"}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none focus:text-cyan-400 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-400 flex items-center gap-1 mt-1 animate-in fade-in duration-200">
            {errors.password}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-zinc-900 font-medium py-2.5 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-zinc-800 disabled:opacity-70 disabled:pointer-events-none"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            <span>Logging in...</span>
          </div>
        ) : (
          "Login"
        )}
      </Button>

    </form>
  )
}

export default EntrepreneurAuthForm
