import axios from "axios";
import type { UserResponse } from "../../../shared/api";
import { API_BASE_URL } from "../../../shared/config/api";

export interface Credentials {
  username: string;
  password: string;
}

export const loginRequest = async (credentials: Credentials): Promise<UserResponse> => {
  const response = await axios.post<UserResponse>(`${API_BASE_URL}/auth/login`, credentials, {
    withCredentials: true,
  });
  return response.data;
};

export const logoutRequest = async (): Promise<void> => {
  await axios.post(`${API_BASE_URL}/auth/logout`, null, { withCredentials: true });
};
