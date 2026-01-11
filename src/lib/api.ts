import { DeviceInfo } from '@/types/device.type';
import type { ActionResult } from '@/types/action.type';
import { fetch } from '@tauri-apps/plugin-http';

const BACKEND_URL = import.meta.env.BACKEND_URL || 'https://backend.xerweon.in/api';

// Helper function for API calls
async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    }
  });
}

export const api = {
  get: async (url: string, config?: { params?: any; headers?: any }) => {
    const fullUrl = url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
    const searchParams = config?.params ? new URLSearchParams(config.params).toString() : '';
    const finalUrl = searchParams ? `${fullUrl}?${searchParams}` : fullUrl;
    
    const response = await apiRequest(finalUrl, {
      method: 'GET',
      headers: config?.headers,
    });
    
    return {
      data: response.ok ? await response.json() : null,
      status: response.status,
      ok: response.ok,
    };
  },

  post: async (url: string, data?: any, config?: { headers?: any }) => {
    const fullUrl = url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
    
    const response = await apiRequest(fullUrl, {
      method: 'POST',
      headers: config?.headers,
      body: JSON.stringify(data),
    });
    
    return {
      data: response.ok ? await response.json() : null,
      status: response.status,
      ok: response.ok,
    };
  },
};

export const registerWorkstation = async (
  centerId: string, 
  token: string, 
  workstationData: DeviceInfo
): Promise<ActionResult> => {
  try {
    if (!centerId || !token || !workstationData) {
      console.error('Invalid parameters provided for workstation registration');
    }
    
    const response = await apiRequest(
      `${BACKEND_URL}/centers/${centerId}/workstations`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          hostName: workstationData.hostName,
          osName: workstationData.osName,
          osVersion: workstationData.osVersion,
          macAddress: workstationData.macAddress,
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Error: ${errorText}`,
      }
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Workstation registered successfully',
      data: data,
    }
  } catch (error) {
    console.error('Error registering workstation:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export const getAllStaffs = async (
  centerId: string,
  token: string
): Promise<ActionResult> => {
  try {
    const response = await apiRequest(
      `${BACKEND_URL}/users/staffs?centerId=${centerId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      return {
        success: false,
        message: `Failed to fetch: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: 'Staff fetched successfully',
      data: data || [],
    };
  } catch (error) {
    console.error('Error fetching staff:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const checkInStaff = async (
  userId: string,
  workstationId: string,
  password: string,
  token: string
) => {
  try {
    const response = await apiRequest(
      `${BACKEND_URL}/users/kiosk/checkin`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          workstationId,
          password,
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Check-in failed',
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const checkOutStaff = async ({
  userId, workstationId, token, password, centerId
}: {
  userId: string,
  workstationId: string,
  centerId: string,
  token: string,
  password: string,
}): Promise<ActionResult> => {
  try {
    const response = await apiRequest(
      `${BACKEND_URL}/users/kiosk/checkout`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          workstationId,
          password,
          centerId
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Check-out failed',
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Staff checked out successfully',
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};