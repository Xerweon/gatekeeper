"use client"

import { useState } from "react"
import { CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Staff } from "@/types/user.type"
import { cn } from "@/lib/utils"

interface StaffCardProps {
  staff: Staff
  onCheckIn: (staffId: string) => void
}

const StaffCard = ({ staff, onCheckIn }: StaffCardProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleCheckIn = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 600))
    onCheckIn(staff.id)
    setIsLoading(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div
      className="relative overflow-hidden bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-md border border-zinc-700/30 rounded-xl p-5 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/10"
      style={{
        boxShadow: isHovered ? "0 10px 30px -10px rgba(215, 236, 241, 0.2)" : "none",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-700",
          isHovered && "opacity-100",
        )}
      />
      {staff.isCheckedIn && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/30">
          <div className="w-2 h-2 bg-green-400 rounded-full">
            <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75"></div>
          </div>
          <span className="text-green-300 text-xs font-medium">Active</span>
        </div>
      )}

      <div className="relative flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div
            className={cn(
              "w-20 h-20 bg-gradient-to-br from-cyan-400/10 to-cyan-300/20 rounded-full flex items-center justify-center transition-all duration-500",
              isHovered && "border-cyan-400/40 ",
            )}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-cyan-400/10 animate-pulse opacity-0 group-hover:opacity-100" />
            <div className="relative z-10 flex items-center justify-center w-full h-full">
              <span className="text-cyan-400 font-semibold text-2xl">{getInitials(staff.fullName)}</span>
            </div>
          </div>
          <div
            className={cn(
              "absolute -inset-1 rounded-full border border-cyan-400/20 opacity-0 transition-all duration-700 scale-90",
              isHovered && "opacity-100 scale-110",
            )}
          />
        </div>
        <div className="space-y-1 min-h-[3.5rem] flex flex-col justify-center">
          <h3 className="text-white font-medium text-lg tracking-tight">{staff.fullName}</h3>
          <p className="text-zinc-400 text-sm">{staff.email}</p>
        </div>
        <div className="w-full pt-2">
          {staff.isCheckedIn ? (
            <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-green-300 text-sm font-medium">Checked In</span>
            </div>
          ) : (
            <Button
              onClick={handleCheckIn}
              disabled={isLoading}
              className={cn(
                "w-full h-10 relative overflow-hidden",
                "bg-cyan-400  hover:bg-cyan-600 border border-cyan-600 text-secondary font-semibold",
               
              )}
      
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                  <span className="text-sm font-medium">Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Clock size={16} className="" />
                  <span className="text-sm font-semibold">Check In</span>
                </div>
              )}
              <div
                className={cn(
                  "absolute inset-0",
                  "hover:cursor-pointer ",
                 
                )}
              />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default StaffCard
