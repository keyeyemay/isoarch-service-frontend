import { useState } from "react";

// Пустое поле или ошибка загрузки (onError) -> файл по умолчанию
export const useFallbackSrc = (src: string | null | undefined, fallback: string) => {
  const [failed, setFailed] = useState(false);

  return {
    src: !src || failed ? fallback : src,
    onError: () => setFailed(true),
  };
};
