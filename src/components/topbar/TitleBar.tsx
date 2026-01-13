"use client"

import { X, Minus, Menu } from "lucide-react"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import LogoWithGradient from "../logo/LogoWithGradient"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { message } from "@tauri-apps/plugin-dialog"
import { getVersion } from "@tauri-apps/api/app"
import { check, type Update } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'
import { toast } from "sonner"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

const appWindow = getCurrentWindow()

const TitleBar = () => {
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [updateInfo, setUpdateInfo] = useState<Update | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [checking, setChecking] = useState(false)

  const handleAboutClick = async () => {
    try {
      const currentVersion = await getVersion()
      await message(
        `Advanced security and access control solution engineered for modern enterprises.\n\n` +
          `Built with cutting-edge technology: Tauri/Rust\n` +
          `© ${new Date().getFullYear()} Cirranex Tech Pvt. Ltd.\n` +
          `All rights reserved.`,
        {
          title: `About xerweon™ GATEKEEPER v${currentVersion}`,
        }
      )
    } catch (error) {
      console.error("Failed to show about message:", error)
    }
  }

  const handleCheckForUpdates = async () => {
    setChecking(true)
    try {
      toast.info("Checking for updates...")
      const update = await check()
      
      if (update) {
        setUpdateInfo(update)
        setUpdateDialogOpen(true)
        toast.success(`Update available: v${update.version}`)
      } else {
        const currentVersion = await getVersion()
        toast.success(`You're running the latest version (v${currentVersion})`)
      }
    } catch (error) {
      console.error("Failed to check for updates:", error)
      toast.error("Failed to check for updates")
    } finally {
      setChecking(false)
    }
  }

  const handleInstallUpdate = async () => {
    if (!updateInfo) return

    try {
      setDownloading(true)
      setDownloadProgress(0)
      
      toast.info("Downloading update...")

      await updateInfo.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started':
            setDownloadProgress(0)
            break
          case 'Progress':
            const chunkLength = event.data.chunkLength
            const contentLength = (event.data as any).contentLength
            
            if (typeof contentLength === 'number' && contentLength > 0) {
              const progress = (chunkLength / contentLength) * 100
              setDownloadProgress(Math.round(progress))
            } else {
              // Incremental progress for unknown size
              setDownloadProgress((prev) => Math.min(99, prev + 1))
            }
            break
          case 'Finished':
            setDownloadProgress(100)
            toast.success("Update installed! Relaunching...")
            break
        }
      })

      // Relaunch the app
      await relaunch()
    } catch (error) {
      console.error("Failed to install update:", error)
      toast.error("Failed to install update")
      setDownloading(false)
      setDownloadProgress(0)
    }
  }

  const handleMenuClick = async () => {
    try {
      await appWindow.emit("open-menu")
    } catch (error) {
      console.error("Failed to open menu:", error)
    }
  }

  const handleMinimize = async () => {
    try {
      await appWindow.minimize()
    } catch (error) {
      console.error("Failed to minimize window:", error)
    }
  }

  const handleClose = async () => {
    try {
      await appWindow.close()
    } catch (error) {
      console.error("Failed to close window:", error)
    }
  }

  return (
    <>
      <div className="select-none bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center justify-between h-10">
          {/* Left section - Menu button and Logo */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
                  onClick={handleMenuClick}
                >
                  <Menu size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xs">
                <DropdownMenuItem onClick={handleAboutClick}>
                  About
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleCheckForUpdates}
                  disabled={checking}
                >
                  {checking ? "Checking..." : "Check for Updates"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleClose}>
                  Quit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div data-tauri-drag-region className="flex-1">
              <LogoWithGradient />
            </div>
          </div>

          {/* Middle section - Draggable area */}
          <div className="flex-1 h-full" data-tauri-drag-region></div>

          {/* Right section - window controls */}
          <div className="flex items-center">
            <div className="flex">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none text-zinc-400 hover:text-white hover:bg-zinc-800"
                      onClick={handleMinimize}
                    >
                      <Minus size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Minimize</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                variant="destructive"
                size="icon"
                className="h-10 w-10 rounded-none text-black hover:text-white hover:bg-red-600"
                onClick={handleClose}
              >
                <X size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Update Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Available</DialogTitle>
            <DialogDescription>
              Version {updateInfo?.version} is now available.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {updateInfo?.body && (
              <div className="rounded-md bg-zinc-900 p-3 max-h-48 overflow-y-auto">
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">
                  {updateInfo.body}
                </p>
              </div>
            )}

            {downloading && (
              <div className="space-y-2">
                <Progress value={downloadProgress} className="h-2" />
                <p className="text-xs text-center text-zinc-400">
                  Downloading... {downloadProgress}%
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex-row gap-2 sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setUpdateDialogOpen(false)}
              disabled={downloading}
            >
              Later
            </Button>
            <Button
              onClick={handleInstallUpdate}
              disabled={downloading}
            >
              {downloading ? "Installing..." : "Update Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TitleBar