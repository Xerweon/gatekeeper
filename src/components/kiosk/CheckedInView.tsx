import {  LogOut } from "lucide-react"
import type { Staff } from "@/types/user.type"


export default function CheckedInView({
  staff,
  getInitials,
  setShowCheckoutDialog
}: {
  staff: Staff
  getInitials: (name: string) => string
  setShowCheckoutDialog: (show: boolean) => void
}) {

  return (
    <div className="max-w-5xl mx-auto ">
      <div className="relative bg-zinc-800/60 backdrop-blur-sm rounded-md p-6 shadow-2xl border border-zinc-700/50 h-110  overflow-hidden">
      
        
        
        {/* Main content with proper z-index */}
        <div className="relative flex flex-col items-center text-center space-y-8 z-10">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-cyan-300/20 rounded-full flex items-center justify-center border border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.4)]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-cyan-400/10 animate-pulse opacity-100" />
              <div className="relative z-10 flex items-center justify-center w-full h-full">
                <span className="text-cyan-400 font-semibold text-4xl drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                  {getInitials(staff.fullName)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl text-zinc-400 font-medium tracking-tight">Checked in as</h3>
            <p className="text-3xl text-white font-medium tracking-tight">
              {staff.fullName}
            </p>
            <p className="text-zinc-400 text-lg">{staff.email}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 w-full max-w-md">
            
            <button
              onClick={() => setShowCheckoutDialog(true)}
              className="hover:cursor-pointer flex items-center justify-center gap-3 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 font-semibold rounded-lg transition-colors duration-200 relative overflow-hidden"
            >
              <LogOut size={18} />
              <span>Check Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}