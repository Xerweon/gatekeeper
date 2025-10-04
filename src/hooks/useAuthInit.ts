import { useEffect, useState } from 'react';
import { getAuthToken } from '@/lib/auth';
import { User } from '@/types/user.type';
import { fetch } from '@tauri-apps/plugin-http';

const BACKEND_URL = import.meta.env.BACKEND_URL || "https://backend.xerweon.in/api";

export const useAuthInit = () => {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const checkToken = async () => {
      const token = await getAuthToken();
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/auth/profile`, {
            headers: {
              "Authorization": `Bearer ${token}`,
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            const userData: User = {
              id: data.id,
              fullName: data.fullName,
              email: data.email,
              centerId: data.centerId,
              role: data.role
            }
            setUser(userData);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
      setIsReady(true);
    };
    checkToken();
  }, [])

  return { isReady, user };
}