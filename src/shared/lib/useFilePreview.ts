import { useState, type ChangeEvent } from "react";

interface FilePreview {
  file: File | null;
  url: string;
}

export const useFilePreview = () => {
  const [preview, setPreview] = useState<FilePreview>({ file: null, url: "" });

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setPreview((previous) => {
      if (previous.url) URL.revokeObjectURL(previous.url);
      return { file, url: file ? URL.createObjectURL(file) : "" };
    });
  };

  return { ...preview, onChange };
};
