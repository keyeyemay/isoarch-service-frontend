import { ISOTOPIC_SIGNATURES_MOCK } from "../model/mock";
import type { IsotopicSignature } from "../model/types";

// В ЛР5 данные берутся только из mock; сигнатуры функций повторяют
// GET /services?c13_max=... веб-сервиса, чтобы позже заменить тело на fetch
export const getIsotopicSignatures = async (c13Max?: number): Promise<IsotopicSignature[]> =>
  ISOTOPIC_SIGNATURES_MOCK.filter(
    (signature) =>
      c13Max === undefined || (signature.delta_c13 !== null && signature.delta_c13 <= c13Max),
  );
