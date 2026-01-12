import DeviceRegistration from "@/components/register-device/DeviceRegistration";
import TitleBar from "@/components/topbar/TitleBar";
import { useAuthInit } from "@/hooks/useAuthInit";


function RegisterDevice() {
  const { user } = useAuthInit();
  return (
    <>
      <header>
          <TitleBar />
      </header>

      <DeviceRegistration user={user} />
      
    </>
  );
}

export default RegisterDevice;