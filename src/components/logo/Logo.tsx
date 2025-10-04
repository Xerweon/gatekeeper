"use client"

import { Shield, ShieldCheck } from "lucide-react"
import { useState } from "react"

const Logo = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="space-grotesk-300 flex items-center gap-2 p-2 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {isHovered ? (
          <ShieldCheck
            size={20}
            className="text-cyan-400 transition-all duration-300 animate-in fade-in"
            strokeWidth={2}
          />
        ) : (
          <Shield size={20} className="text-cyan-400 transition-all duration-300" strokeWidth={2} />
        )}
      </div>

      <div className="flex items-baseline">
        <h1 className="text-base font-light tracking-tight">
          <span className="text-zinc-300">xerw</span>
          <span className="text-cyan-400 font-light">eon</span>
          <span className="mx-1.5 text-zinc-600 dark:text-zinc-700">|</span>
          <span className="font-bold text-white tracking-wide uppercase text-sm">
            Gate<span className="text-cyan-400">Keeper</span>
          </span>
        </h1>
      </div>
    </div>
  )
}

export default Logo
