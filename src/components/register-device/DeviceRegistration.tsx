import { Button } from "@/components/ui/button";
import { getAuthToken } from "@/lib/auth";
import { User } from "@/types/user.type";
import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { DeviceInfo } from "@/types/device.type";
import { registerWorkstation } from "@/lib/api";
import { setDeviceId, setDeviceInfo } from "@/lib/device";
import { api } from "@/lib/api";

const DeviceRegistration = ({ user }: { user: User | undefined }) => {
  const [info, setInfo] = useState<DeviceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!user?.centerId) {
      setLoading(false);
      return;
    }

    const fetchInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        const parsed = await invoke<{
          host_name: string;
          os_name: string;
          os_version: string;
          mac_address?: string | null;
        }>("get_device_info");

        const formattedInfo: DeviceInfo = {
          hostName: parsed.host_name || "Unknown Device",
          osName: parsed.os_name || "Unknown OS",
          osVersion: parsed.os_version || "Unknown Version",
          macAddress: parsed.mac_address ?? undefined,
        };

        const authToken = await getAuthToken();
        setToken(authToken ?? undefined);

        if (!mountedRef.current) return;
        setInfo(formattedInfo);

        // Prefer mac-based check if available
        if (formattedInfo.macAddress) {
          try {
            const resp = await api.get(
              `/centers/${user.centerId}/workstations/by-mac`,
              {
                params: { macAddress: formattedInfo.macAddress },
                headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
              }
            );
            const body = resp.data ?? {};
            if (body.registered || body.workstationId) {
              const workstationId = body.workstationId ?? body.data?.id;
              if (workstationId) {
                await setDeviceId(workstationId);
                await setDeviceInfo(formattedInfo);
                if (!mountedRef.current) return;
                setRegistered(true);
                navigate("/kiosk");
                return;
              }
            }
          } catch (err) {
            // non-fatal; fallback to host/os check below
            console.warn("mac check failed, falling back to host/os check", err);
          }
        }

        // fallback: host/os check (existing behavior)
        const params = new URLSearchParams();
        params.set("hostName", formattedInfo.hostName);
        params.set("osName", formattedInfo.osName);
        params.set("osVersion", formattedInfo.osVersion);

        try {
          const resp = await api.get(`/centers/${user.centerId}/workstations`, {
            params,
            headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
          });
          const body = resp.data ?? {};
          if (body.registered || body.workstationId) {
            const workstationId = body.workstationId ?? body.data?.id;
            if (workstationId) {
              await setDeviceId(workstationId);
              await setDeviceInfo(formattedInfo);
              if (!mountedRef.current) return;
              setRegistered(true);
              navigate("/kiosk");
              return;
            }
          }
        } catch (err) {
          console.warn("host/os check failed", err);
        }
      } catch (err: unknown) {
        console.error("DeviceRegistration fetchInfo error:", err);
        if (mountedRef.current) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchInfo();
  }, [user?.centerId, navigate]);

  if (loading) {
    return (
      <div className="bg-zinc-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-zinc-700/50">
        <h2 className="text-2xl font-semibold text-center text-white mt-4 mb-6">Register Device</h2>
        <p className="text-zinc-400 text-center mb-8 text-sm">Loading device information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-zinc-700/50">
        <h2 className="text-2xl font-semibold text-center text-white mt-4 mb-6">Register Device</h2>
        <p className="text-red-400 text-center mb-8 text-sm">Error loading device info: {error}</p>
        <div className="flex justify-center">
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const handleClick = async () => {
    setError(null);

    if (!info || !user) {
      setError("Device information or user data is not available.");
      return;
    }

    if (!token) {
      setError("Authentication token missing. Please login again.");
      return;
    }

    setIsRegistering(true);
    try {
      const workstationData: any = {
        hostName: info.hostName,
        osName: info.osName,
        osVersion: info.osVersion,
      };
      if ((info as any).macAddress) workstationData.macAddress = (info as any).macAddress;

      const result = await registerWorkstation(user.centerId, token, workstationData);

      if (result.success) {
        const workstationId = (result as any).data?.id ?? (result as any).data?.workstationId;
        if (workstationId) await setDeviceId(workstationId);
        await setDeviceInfo(info);
        navigate("/kiosk");
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (err: unknown) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      if (mountedRef.current) setIsRegistering(false);
    }
  };

  return (
    <div className="bg-zinc-800/80 backdrop-blur-sm p-8 mt-2 rounded-xs shadow-2xl border border-zinc-700/50">
      <h2 className="text-2xl font-semibold text-center text-white mt-4 mb-6">Register Device</h2>

      <p className="text-zinc-400 text-center mb-8 text-sm">
        Host Information:{" "}
        {info && (
          <>
            {info.hostName} | {info.osName} {info.osVersion}
            { (info as any).macAddress ? <> — <span className="font-mono text-xs">{(info as any).macAddress}</span></> : null }
          </>
        )}
      </p>

      <p className="text-zinc-400 text-center mb-8 text-sm">
        Seems like this device is not registered yet. Please register it to continue to the kiosk.
      </p>

      <div className="flex justify-center mt-6">
        <Button
          type="button"
          variant="default"
          onClick={handleClick}
          disabled={isRegistering || !token}
          className="bg-cyan-400 hover:bg-cyan-500 text-secondary hover:cursor-pointer disabled:opacity-60"
        >
          {isRegistering ? "Registering..." : "Register Workstation"}
        </Button>
      </div>

      {!token && (
        <p className="text-yellow-300 text-center mt-4 text-sm">
          You need to be logged in to register this device. Please log in again.
        </p>
      )}

      {registered && (
         <p className="text-green-400 text-center mt-4 text-sm">
          This device is registered.
        </p>
      )}
    </div>
  );
};

export default DeviceRegistration;
