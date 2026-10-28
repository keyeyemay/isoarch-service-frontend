import { useState } from "react";

export const useFallbackSrc = (src: string | null | undefined, fallback: string) => {
  const [failed, setFailed] = useState(false);

  return {
    src: !src || failed ? fallback : src,
    onError: () => setFailed(true),
  };
};
