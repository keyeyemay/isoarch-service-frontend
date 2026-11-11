import { MINIO_ORIGIN, S3_PROXY_PREFIX } from "../../../shared/config/api";
import type { IsotopicSignature, SignatureDraft } from "../model/types";

export const toMediaSrc = (url: string): string => {
  if (url.startsWith(MINIO_ORIGIN)) return S3_PROXY_PREFIX + url.slice(MINIO_ORIGIN.length);
  if (url.startsWith("/static/")) return "";
  return url;
};

export const withMediaSrc = <T extends IsotopicSignature | SignatureDraft>(signature: T): T => ({
  ...signature,
  image_url: toMediaSrc(signature.image_url),
  video_url: toMediaSrc(signature.video_url),
});
