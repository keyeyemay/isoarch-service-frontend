import { useState } from "react";
import { resetFilterAction } from "../../../entities/isotopic-signature";
import { resetUserAction } from "../../../entities/user";
import { useAppDispatch } from "../../../shared/lib/redux";
import { logoutRequest } from "../api/authApi";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    try {
      await logoutRequest();
    } catch {
    } finally {
      dispatch(resetUserAction());
      dispatch(resetFilterAction());
      setLoading(false);
    }
  };

  return { logout, loading };
};
