"use client"

import { useState, useEffect } from "react"
import * as ScrollArea from "@radix-ui/react-scroll-area"
import type {  Staff, UserCheckin, User } from "@/types/user.type"
import type { DeviceInfo } from "@/types/device.type"
import { getAuthToken } from "@/lib/auth"
import { checkInStaff, checkOutStaff, getAllStaffs } from "@/lib/api"
import HeaderSection from "./Header"
import CheckedInView from "./CheckedInView"
import StaffGridView from "./StaffGridView"
import CheckoutDialog from "./CheckoutDialog"
import CheckinDialog from "./CheckinDialog"
import { getDeviceId, getDeviceInfo } from "@/lib/device"
import { toast } from "sonner"

const isCheckedIn = (checkins: UserCheckin[], workstationId?: string): boolean => {
  if (!Array.isArray(checkins) || checkins.length === 0) return false;
  
  const today = new Date().toISOString().split("T")[0];
  
  if (!workstationId) {
    // fallback: previous behaviour (date-only)
    return checkins.some(ci => {
      if (!ci.checkinTime || ci.checkoutTime) return false; // Skip if checked out
      const d = new Date(ci.checkinTime);
      return !isNaN(d.getTime()) && d.toISOString().split("T")[0] === today;
    });
  }

  return checkins.some(ci => {
    // Must have checkinTime and NO checkoutTime
    if (!ci.checkinTime || ci.checkoutTime) return false;
    
    const d = new Date(ci.checkinTime);
    if (isNaN(d.getTime())) {
      console.warn("Invalid checkinTime:", ci.checkinTime);
      return false;
    }
    
    // Check if it's today AND matches workstation (or workstation is undefined for backwards compatibility)
    return (
      (ci.workstationId === workstationId || ci.workstationId === undefined) &&
      d.toISOString().split("T")[0] === today
    );
  });
};

const KioskContainer = ({ user }: { user: User | undefined }) => {
  const [staff, setStaff] = useState<Staff[] | null>(null)
  const [checkedInStaff, setCheckedInStaff] = useState<Staff | null>(null)
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    hostName: "Loading...",
    osName: "Loading...",
    osVersion: "Loading...",
    workstationId: "Loading..."
  })
  const [showCheckinDialog, setShowCheckinDialog] = useState(false)
  const [checkinPassword, setCheckinPassword] = useState("")
  const [showCheckinPassword, setShowCheckinPassword] = useState(false)
  const [checkinPasswordError, setCheckinPasswordError] = useState("")
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [pendingStaffId, setPendingStaffId] = useState<string | null>(null)

  // Extract fetch logic into reusable function
  const fetchStaffsData = async () => {
    try {
      const authToken = await getAuthToken();
      if (!authToken || !user?.centerId) {
        console.error("Auth token or centerId is not defined");
        return;
      }

      const workstationId = await getDeviceId();
      const response = await getAllStaffs(user.centerId, authToken);

      if (!response.success) {
        console.error("Failed to fetch staff:", response.message);
        return;
      }

      const staffData: Staff[] = (response.data || []).map((s: Staff) => ({
        ...s,
        isCheckedIn: isCheckedIn(s.checkins || [], workstationId),
      }));

      setStaff(staffData);

      // find staff checked in on this workstation
      const currentlyCheckedIn = staffData.find((s: Staff) => s.isCheckedIn);
      setCheckedInStaff(currentlyCheckedIn || null);
    } catch (error) {
      console.error("Error fetching staff data:", error);
    }
  };

  useEffect(() => {
    const fetchStaffsAndDeviceInfo = async () => {
      try {
        const [device, workstationId] = await Promise.all([
          getDeviceInfo(),
          getDeviceId(),
        ]);

        setDeviceInfo({
          hostName: device?.hostName || "Unknown Device",
          osName: device?.osName || "Unknown OS",
          osVersion: device?.osVersion || "Unknown Version",
          workstationId: workstationId || "Unknown workstation"
        });
        
        await fetchStaffsData();
      } catch (error) {
        console.error("Error in fetchStaffsAndDeviceInfo:", error);
      }
    };

    fetchStaffsAndDeviceInfo();
  }, [user?.centerId]);


  const handleCheckIn = (staffId: string) => {
    if (checkedInStaff) return
    setPendingStaffId(staffId)
    setShowCheckinDialog(true)
  }

  const confirmCheckIn = async () => {
    if (!checkinPassword.trim()) {
      setCheckinPasswordError("Password is required");
      return;
    }

    if (!pendingStaffId) return;

    const authToken = await getAuthToken();
    const workstationId = await getDeviceId();

    if (!authToken || !workstationId) {
      console.error("Auth token or workstationID is not defined");
      toast.error('Check-in Failed', {
        description: 'Missing required information',
      })
      return;
    }

    setIsCheckingIn(true)

    try {
      const result = await checkInStaff(
        pendingStaffId,
        workstationId,
        checkinPassword,
        authToken
      );

      if (!result.success) {
        toast.error('Check-in Failed', {
          description: result.message || 'Please try again',
        })
        setCheckinPasswordError(result.message || "Failed to check in staff");
        return;
      }

      toast.success('Checked In Successfully', {
        description: 'Welcome! You can now login to xerweon.',
      })

      // Reset dialog states
      setShowCheckinDialog(false);
      setCheckinPassword("");
      setCheckinPasswordError("");
      setShowCheckinPassword(false);
      setPendingStaffId(null);

      // Refetch to sync with backend
      await fetchStaffsData();

    } catch (error) {
      toast.error('Check-in Failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
      setCheckinPasswordError("An unexpected error occurred")
    } finally {
      setIsCheckingIn(false)
    }
  };


  const handleCheckOut = async () => {
    if (!password.trim()) {
      setPasswordError("Password is required")
      return
    }
    
    const workstationId = await getDeviceId()
    const token = await getAuthToken();
    const userId = checkedInStaff?.id;

    if (!workstationId || !token || !userId) {
      console.error("Workstation ID, staffId or token is not defined")
      toast.error('Checkout Failed', {
        description: 'Missing required information',
      })
      return
    }
    
    setIsCheckingOut(true)
    
    try {
      const checkOutResponse = await checkOutStaff({
        userId,
        workstationId,
        token,
        password,
        centerId: user?.centerId || "",
      })

      if (checkOutResponse.success) {
        toast.success('Checked Out Successfully', {
          description: 'You have been checked out. Have a great day!',
        })
        
        // Reset dialog state
        setShowCheckoutDialog(false)
        setPassword("")
        setPasswordError("")
        setShowPassword(false)

        // Refetch to sync with backend
        await fetchStaffsData();
      } else {
        toast.error('Checkout Failed', {
          description: checkOutResponse.message || 'Please try again',
        })
        setPasswordError(checkOutResponse.message || "Failed to check out")
      }
    } catch (error) {
      toast.error('Checkout Failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
      setPasswordError("An unexpected error occurred")
    } finally {
      setIsCheckingOut(false)
    }
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
    <div className="w-full h-full flex flex-col pt-2">
      <HeaderSection deviceInfo={deviceInfo} />
    
      <div className="flex-1 relative">
        <ScrollArea.Root className="w-full h-full ">
          <ScrollArea.Viewport className="w-full h-full" style={{
            scrollBehavior: "auto",
          }}>
            <div className="p-4 sm:p-6 lg:p-8">
              {checkedInStaff ? (
                <CheckedInView
                  staff={checkedInStaff}
                  getInitials={getInitials}
                  setShowCheckoutDialog={setShowCheckoutDialog}
                />
              ) : (
                <StaffGridView 
                  staff={staff} 
                  onCheckIn={handleCheckIn} 
                />
              )}
              <div className="h-8"></div>
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            orientation="vertical"
            className="flex select-none touch-none p-0.5 w-3 transition-colors duration-200 rounded-r-lg"
          >
            <ScrollArea.Thumb className="flex-1" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>

      
      <CheckoutDialog
        open={showCheckoutDialog}
        onOpenChange={setShowCheckoutDialog}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        passwordError={passwordError}
        setPasswordError={setPasswordError}
        onCheckout={handleCheckOut}
        isLoading={isCheckingOut}
      />
      
      <CheckinDialog
        open={showCheckinDialog}
        onOpenChange={setShowCheckinDialog}
        checkinPassword={checkinPassword}
        setCheckinPassword={setCheckinPassword}
        showCheckinPassword={showCheckinPassword}
        setShowCheckinPassword={setShowCheckinPassword}
        checkinPasswordError={checkinPasswordError}
        setCheckinPasswordError={setCheckinPasswordError}
        onConfirm={confirmCheckIn}
        isLoading={isCheckingIn}
      />
    </div>
  )
}

export default KioskContainer