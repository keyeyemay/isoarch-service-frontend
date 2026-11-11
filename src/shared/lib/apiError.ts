import { isAxiosError } from "axios";

export const isBackendUnavailable = (error: unknown): boolean =>
  isAxiosError(error) && (!error.response || error.response.status >= 500);

export const getErrorStatus = (error: unknown): number | undefined =>
  isAxiosError(error) ? error.response?.status : undefined;

const STATUS_MESSAGES: Record<number, string> = {
  401: "Требуется вход",
  403: "Действие доступно только автору записи",
  404: "Запись не найдена или недоступна",
  409: "Конфликт состояния записи (например, черновик уже существует)",
  413: "Файл слишком большой",
  503: "Хранилище медиа или сессий недоступно",
};

export const getErrorMessage = (error: unknown, fallback = "Ошибка запроса"): string => {
  if (!isAxiosError(error)) return fallback;
  if (!error.response) return "Сервер недоступен";

  const { status, data } = error.response;
  if (STATUS_MESSAGES[status]) return STATUS_MESSAGES[status];

  const detail: unknown = data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item: { msg?: string }) => item.msg).filter(Boolean).join("; ") || fallback;
  }
  return typeof detail === "string" ? detail : fallback;
};
