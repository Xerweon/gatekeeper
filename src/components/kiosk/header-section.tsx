import DeviceInfoComponent from "./device-info"
import type { DeviceInfo } from "@/types/device.type"

export default function HeaderSection({
  deviceInfo,

}: {
  deviceInfo: DeviceInfo
}) {
  return (
    <div className="sticky top-0 z-20 bg-zinc-900">
      <div className="px-4 sm:px-6 lg:px-8 py-2 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6" />
        </div>
      </div>
      <div className="mx-4 sm:mx-6 lg:mx-8 p-4 bg-zinc-800/60 backdrop-blur-sm rounded-lg shadow-lg border border-zinc-700/50">
        <DeviceInfoComponent deviceInfo={deviceInfo} />
      </div>
    </div>
  )
}