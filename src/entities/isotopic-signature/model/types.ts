// Поля совпадают с публичным ответом веб-сервиса ЛР4 (ServiceResponse)
export interface IsotopicSignature {
  id: number;
  title: string;
  description: string | null;
  delta_n15: number | null;
  delta_c13: number | null;
  image_url: string;
  video_url: string;
  status: "published";
  created_at: string;
  formed_at: string | null;
  likes_count: number;
  is_liked: 0 | 1;
  is_creator: 0 | 1;
}

// Общий список сигнатур, который layout передаёт страницам через Outlet context
export interface SignaturesOutletContext {
  signatures: IsotopicSignature[];
  setSignatures: (signatures: IsotopicSignature[]) => void;
}
