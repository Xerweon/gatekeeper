"use client"

import { useState, useEffect } from "react"
import * as ScrollArea from "@radix-ui/react-scroll-area"
import type {  Staff, UserCheckin, User } from "@/types/user.type"
import type { DeviceInfo } from "@/types/device.type"
import { getAuthToken } from "@/lib/auth"
import { checkInStaff, checkOutStaff, getAllStaffs } from "@/lib/api"
import HeaderSection from "./header-section"
import CheckedInView from "./checked-in-view"
import StaffGridView from "./staff-grid-view"
import CheckoutDialog from "./checkout-dialog"
import CheckinDialog from "./checkin-dialog"
import { getDeviceId, getDeviceInfo } from "@/lib/device"

const isCheckedIn = (checkins: UserCheckin[], workstationId?: string): boolean => {
  if (!Array.isArray(checkins) || checkins.length === 0) return false;
  if (!workstationId) {
    // fallback: previous behaviour (date-only)
    const today = new Date().toISOString().split("T")[0];
    return checkins.some(ci => {
      const d = new Date(ci.checkinTime);
      return !isNaN(d.getTime()) && d.toISOString().split("T")[0] === today;
    });
  }

  const today = new Date().toISOString().split("T")[0];
  return checkins.some(ci => {
    if (!ci.checkinTime) return false;
    const d = new Date(ci.checkinTime);
    if (isNaN(d.getTime())) {
      console.warn("Invalid checkinTime:", ci.checkinTime);
      return false;
    }
    
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
  
  const [pendingStaffId, setPendingStaffId] = useState<string | null>(null)

  useEffect(() => {
    const fetchStaffsAndDeviceInfo = async () => {
      try {
        const authToken = await getAuthToken();
        if (!authToken) {
          console.error("Auth token is not defined");
          return;
        }

        if (!user?.centerId) return;

        // Get both device info and workstationId
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
        if (currentlyCheckedIn) {
          setCheckedInStaff(currentlyCheckedIn);
        } else {
          setCheckedInStaff(null);
        }
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
      return;
    }
    const result = await checkInStaff(
      pendingStaffId,
      workstationId,
      checkinPassword,
      authToken
    );

    if (!result.success) {
      setCheckinPasswordError(result.message || "Failed to check in staff");
      return;
    }

    // Successful check-in logic here...
    const staffMember = staff?.find((s) => s.id === pendingStaffId);
    if (staffMember) {
      setCheckedInStaff(staffMember);
      setStaff((prevStaff) =>
        prevStaff
          ? prevStaff.map((member) =>
              member.id === pendingStaffId
                ? { ...member, isCheckedIn: true }
                : { ...member, isCheckedIn: false }
            )
          : prevStaff
      );
    }

    // Reset dialog states
    setShowCheckinDialog(false);
    setCheckinPassword("");
    setCheckinPasswordError("");
    setShowCheckinPassword(false);
    setPendingStaffId(null);
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
      return
    }
    
    await checkOutStaff({
      userId,
      workstationId,
      token,
      password,
      centerId: user?.centerId || "",
    })

    // console.log("Check out response:", checkOutResponse)

    setCheckedInStaff(null)
    setStaff((prevStaff) => 
      prevStaff ? prevStaff.map(member => ({ ...member, isCheckedIn: false })) : prevStaff
    )
    setShowCheckoutDialog(false)
    setPassword("")
    setPasswordError("")
    setShowPassword(false)
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
      />
    </div>
  )
}

export default KioskContainer