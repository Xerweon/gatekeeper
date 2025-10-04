"use client"

import { Shield, ShieldCheck, Lock, Unlock } from "lucide-react"
import { useState, useEffect } from "react"

const LogoAnimated = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isLocked, setIsLocked] = useState(true)

  // Toggle lock state every few seconds for a subtle animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLocked((prev) => !prev)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="space-grotesk-300 flex items-center gap-2.5 p-2 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-6 w-6 flex items-center justify-center">
        <div className={`absolute transition-all duration-500 ${isLocked ? "opacity-100" : "opacity-0"}`}>
          <Shield size={20} className="text-cyan-400" strokeWidth={2} />
        </div>
        <div className={`absolute transition-all duration-500 ${isLocked ? "opacity-0" : "opacity-100"}`}>
          <ShieldCheck size={20} className="text-cyan-400" strokeWidth={2} />
        </div>
      </div>

      <div className="flex items-baseline">
        <h1 className="text-base font-medium tracking-tight flex items-baseline">
          <span className="text-zinc-300">xerw</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300 font-semibold">
            eon
          </span>
          <span className="mx-1.5 text-zinc-600 dark:text-zinc-700">|</span>
          <div className="relative">
            <span className="font-bold text-white tracking-wide uppercase text-sm">GateKeeper</span>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-transparent"></div>
          </div>
        </h1>
      </div>

      <div className="relative h-4 w-4 flex items-center justify-center">
        <div
          className={`absolute transition-all duration-300 ${isHovered ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
        >
          <Lock size={14} className="text-cyan-400" strokeWidth={2.5} />
        </div>
        <div
          className={`absolute transition-all duration-300 ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        >
          <Unlock size={14} className="text-cyan-400" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  )
}

export default LogoAnimated
