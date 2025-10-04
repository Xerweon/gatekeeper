import * as Dialog from "@radix-ui/react-dialog"
import { X, Eye, EyeOff, Loader2 } from "lucide-react"

export default function CheckoutDialog({
  open,
  onOpenChange,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  passwordError,
  setPasswordError,
  onCheckout,
  isLoading = false, // Add this prop
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  password: string
  setPassword: (password: string) => void
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  passwordError: string
  setPasswordError: (error: string) => void
  onCheckout: () => void | Promise<void>
  isLoading?: boolean // Add this prop
}) {
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setPasswordError("Password is required")
      return
    }
    await onCheckout()
  }

  const handleClose = () => {
    setPassword("")
    setPasswordError("")
    setShowPassword(false)
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-700 rounded-sm p-6 w-full max-w-md z-50 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-bold text-white">
              Confirm Check Out
            </Dialog.Title>
            <Dialog.Close 
              className="p-2 hover:bg-zinc-800 rounded-sm transition-colors"
              disabled={isLoading}
            >
              <X size={20} className="text-zinc-400" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-zinc-300">
              Are you sure you want to check out? Please enter your password to confirm.
            </p>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError("")
                  }}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-12"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-300"
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-400 text-sm">{passwordError}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Dialog.Close 
                type="button"
                className="flex-1 hover:cursor-pointer px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Cancel
              </Dialog.Close>
              <button
                type="submit"
                className="hover:cursor-pointer flex-1 px-4 py-3 bg-red-900 hover:bg-red-800 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isLoading || !password.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Checking Out...
                  </>
                ) : (
                  "Check Out"
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}