export const BASE_PATH = import.meta.env.BASE_URL;
export const ROUTER_BASENAME = BASE_PATH.replace(/\/$/, "") || "/";

export const IS_MOCK_ONLY = import.meta.env.VITE_DATA_SOURCE === "mock";

export const API_BASE_URL = `${window.location.origin}/api`;

export const S3_PROXY_PREFIX = "/s3";
export const MINIO_ORIGIN = "http://localhost:9000";
