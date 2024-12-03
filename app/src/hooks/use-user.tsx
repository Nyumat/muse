import Fetcher from "@/lib/fetcher";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export type User = {
  _id: string;
  email: string;
  name: string;
  username: string;
};

interface UseUserReturn {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const fetchUser = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await Fetcher.getInstance().get<User>("/auth/user");
      setUser(response.data);
    } catch (err) {
      setUser(null);

      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Failed to fetch user data"));
      }

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          navigate("/login");
          toast.error("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
      setUser(null);
    }
  }, []);

  const refetch = async (): Promise<void> => {
    await fetchUser();
  };

  return {
    user,
    isLoading,
    error,
    refetch,
  };
};
