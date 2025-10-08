import { Monitor, Cpu, Hash } from "lucide-react"
import type { DeviceInfo } from "@/types/device.type"
import { cn } from "@/lib/utils"

interface DeviceInfoProps {
  deviceInfo: DeviceInfo
  className?: string
}

const DeviceInfoComponent = ({ deviceInfo, className }: DeviceInfoProps) => {
  return (
    <div className={cn("rounded-lg", className)}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-sm">
        <div className="flex items-center gap-2 text-zinc-300">
          <Monitor size={16} className="text-cyan-400 flex-shrink-0" />
          <span className="font-medium truncate">{deviceInfo.hostName}</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <Cpu size={16} className="text-zinc-500 flex-shrink-0" />
          <span className="truncate">{deviceInfo.osName} {deviceInfo.osVersion}</span>
        </div>

        <div className="flex items-center gap-1 text-zinc-400">
          <Hash size={16} className="text-zinc-500 flex-shrink-0" />
          <span className="truncate">Workstation ID - {deviceInfo.workstationId}</span>
        </div>
       
        <div className="ml-auto hidden sm:block">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">Online</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeviceInfoComponent
