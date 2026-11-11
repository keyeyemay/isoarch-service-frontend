import { API_BASE_URL } from "../config/api";
import { Api } from "./Api";

export const api = new Api({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export type {
  LikeResponse,
  PublishRequest,
  ServiceDraftResponse,
  ServiceResponse,
  UserResponse,
} from "./Api";
