"use client"

import { X, Minus, Menu } from "lucide-react"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import LogoWithGradient from "../logo/LogoWithGradient"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { message } from "@tauri-apps/plugin-dialog"
import { getVersion } from "@tauri-apps/api/app"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const appWindow = getCurrentWindow();


const TitleBar = () => {

  const handleAboutClick = async () => {
    try {
      const currentVersion = await getVersion();
      await message(
            `Advanced security and access control solution engineered for modern enterprises.\n\n` +
            `Built with cutting-edge technology: Tauri/Rust\n` +
           
            `© ${new Date().getFullYear()} Cirranex Tech Pvt. Ltd.\n` +
            `All rights reserved.`,
            {
                title: `About xerweon™ GATEKEEPER v${currentVersion}`,
            }
        );
    } catch (error) {
      console.error("Failed to show about message:", error)
    }
  }
  const handleMenuClick = async () => {
    try {
      await appWindow.emit("open-menu");
    } catch (error) {
      console.error("Failed to open menu:", error)
    }
  }

  const handleMinimize = async () => {
    try {
      await appWindow.minimize();
    } catch (error) {
      console.error("Failed to minimize window:", error)
    }
  }

  

  const handleClose = async () => {
    try {
      await appWindow.close();
    } catch (error) {
      console.error("Failed to close window:", error)
    }
  }

  return (
    <div className="select-none bg-zinc-900 border-b border-zinc-800">
      <div className="flex items-center justify-between h-10">
        {/* Left section - Menu button and Logo */}
        <div className="flex items-center">
          {/*  */}
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
              {/* <DropdownMenuLabel className="text-center">Menu</DropdownMenuLabel>
              <DropdownMenuSeparator /> */}
              <DropdownMenuItem variant="default" onClick={handleAboutClick}>
                About
              </DropdownMenuItem>
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

        {/* Right section -  window controls */}
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
  )
}

export default TitleBar
