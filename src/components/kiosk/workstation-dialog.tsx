import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"

const mockWorkstations = [
  { id: "ws-001", name: "Workstation Alpha", status: "active", location: "Floor 1" },
  { id: "ws-002", name: "Workstation Beta", status: "active", location: "Floor 2" },
  { id: "ws-003", name: "Workstation Gamma", status: "active", location: "Floor 1" },
  { id: "ws-004", name: "Workstation Delta", status: "maintenance", location: "Floor 3" },
]

export default function WorkstationDialog({
  open,
  onOpenChange,
  onWorkstationSelect
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWorkstationSelect: (id: string) => void
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-700 rounded-xs p-6 w-full max-w-2xl max-h-[80vh] overflow-auto z-50 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-bold text-white">Switch Workstation</Dialog.Title>
            <Dialog.Close className="p-2 hover:bg-zinc-800 rounded-sm transition-colors">
              <X size={20} className="text-zinc-400" />
            </Dialog.Close>
          </div>

          <div className="space-y-3">
            {mockWorkstations.map((workstation) => (
              <button
                key={workstation.id}
                onClick={() => onWorkstationSelect(workstation.id)}
                disabled={workstation.status !== "active"}
                className={`w-full p-4 rounded-xl border text-left transition-colors duration-200 ${
                  workstation.status === "active"
                    ? "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-cyan-500/50"
                    : "border-zinc-800 bg-zinc-900/50 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{workstation.name}</h4>
                    <p className="text-sm text-zinc-400">{workstation.location}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      workstation.status === "active"
                        ? "bg-green-900/30 text-green-400 border border-green-500/30"
                        : "bg-orange-900/30 text-orange-400 border border-orange-500/30"
                    }`}
                  >
                    {workstation.status}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}