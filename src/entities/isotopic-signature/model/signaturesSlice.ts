import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { api, type LikeResponse } from "../../../shared/api";
import { IS_MOCK_ONLY } from "../../../shared/config/api";
import { getErrorMessage, getErrorStatus, isBackendUnavailable } from "../../../shared/lib/apiError";
import { withMediaSrc } from "../lib/mediaUrl";
import { ISOTOPIC_SIGNATURES_MOCK } from "./mock";
import type {
  AppliedSignatureFilter,
  IsotopicSignature,
  NewSignatureData,
  PublishSignatureData,
  SignatureDraft,
  SignatureFilterInput,
} from "./types";

export const C13_MIN = -25;
export const C13_MAX = -10;

export interface SignaturesState {
  filter: SignatureFilterInput;
  appliedFilter: AppliedSignatureFilter;
  list: IsotopicSignature[];
  current: IsotopicSignature | null;
  draft: SignatureDraft | null;
  pending: number;
  error: string | null;
  isMock: boolean;
}

const initialFilter: SignatureFilterInput = { c13Max: String(C13_MAX), title: "" };
const initialAppliedFilter: AppliedSignatureFilter = { c13Max: null, title: "" };

const initialState: SignaturesState = {
  filter: initialFilter,
  appliedFilter: initialAppliedFilter,
  list: [],
  current: null,
  draft: null,
  pending: 0,
  error: null,
  isMock: false,
};

interface ThunkState {
  signatures: SignaturesState;
  user: { isAuthenticated: boolean };
}

interface ThunkConfig {
  state: ThunkState;
  rejectValue: string;
}

const canUseMock = (error: unknown, state: ThunkState) =>
  !state.user.isAuthenticated && isBackendUnavailable(error);

const filterMock = ({ c13Max, title }: AppliedSignatureFilter) =>
  ISOTOPIC_SIGNATURES_MOCK.filter(
    (item) =>
      (c13Max === null || (item.delta_c13 !== null && item.delta_c13 <= c13Max)) &&
      item.title.toLowerCase().includes(title.trim().toLowerCase()),
  );

export const getSignaturesList = createAsyncThunk<
  { items: IsotopicSignature[]; isMock: boolean },
  void,
  ThunkConfig
>("signatures/getSignaturesList", async (_, { getState, rejectWithValue }) => {
  const { c13Max, title } = getState().signatures.appliedFilter;
  if (IS_MOCK_ONLY) {
    return { items: filterMock(getState().signatures.appliedFilter), isMock: true };
  }
  try {
    const { data } = await api.services.getServices({
      ...(c13Max !== null && { c13_max: c13Max }),
      ...(title.trim() && { filter: title.trim() }),
    });
    return { items: data.map(withMediaSrc), isMock: false };
  } catch (error) {
    if (canUseMock(error, getState())) {
      return { items: filterMock(getState().signatures.appliedFilter), isMock: true };
    }
    return rejectWithValue(getErrorMessage(error, "Не удалось загрузить сигнатуры"));
  }
});

export const getSignature = createAsyncThunk<
  { item: IsotopicSignature; isMock: boolean },
  number,
  ThunkConfig
>("signatures/getSignature", async (id, { getState, rejectWithValue }) => {
  if (IS_MOCK_ONLY) {
    const item = ISOTOPIC_SIGNATURES_MOCK.find((signature) => signature.id === id);
    return item ? { item, isMock: true } : rejectWithValue("Сигнатура не найдена");
  }
  try {
    const { data } = await api.services.getFeedById(id);
    return { item: withMediaSrc(data), isMock: false };
  } catch (error) {
    if (canUseMock(error, getState())) {
      const item = ISOTOPIC_SIGNATURES_MOCK.find((signature) => signature.id === id);
      if (item) return { item, isMock: true };
      return rejectWithValue("Сигнатура не найдена");
    }
    if (getErrorStatus(error) === 404) return rejectWithValue("Сигнатура не найдена");
    return rejectWithValue(getErrorMessage(error, "Не удалось загрузить сигнатуру"));
  }
});

export const getDraft = createAsyncThunk<SignatureDraft | null, void, ThunkConfig>(
  "signatures/getDraft",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.services.getDraft();
      return data ? withMediaSrc(data) : null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Не удалось загрузить черновик"));
    }
  },
);

export const createDraft = createAsyncThunk<SignatureDraft, NewSignatureData, ThunkConfig>(
  "signatures/createDraft",
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await api.services.createDraft(body);
      return withMediaSrc(data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Не удалось создать черновик"));
    }
  },
);

export const publishDraft = createAsyncThunk<
  IsotopicSignature,
  { id: number; data: PublishSignatureData },
  ThunkConfig
>("signatures/publishDraft", async ({ id, data: body }, { rejectWithValue }) => {
  try {
    const { data } = await api.services.publishDraft(id, body);
    return withMediaSrc(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Не удалось опубликовать сигнатуру"));
  }
});

export const deleteSignature = createAsyncThunk<number, number, ThunkConfig>(
  "signatures/deleteSignature",
  async (id, { rejectWithValue }) => {
    try {
      await api.services.deleteService(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Не удалось удалить сигнатуру"));
    }
  },
);

export const toggleLike = createAsyncThunk<
  LikeResponse & { id: number },
  { id: number; like: 0 | 1 },
  ThunkConfig
>("signatures/toggleLike", async ({ id, like }, { rejectWithValue }) => {
  try {
    const { data } = await api.services.toggleLike(id, { like });
    return { ...data, id };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Не удалось изменить лайк"));
  }
});

const thunks = [
  getSignaturesList,
  getSignature,
  getDraft,
  createDraft,
  publishDraft,
  deleteSignature,
  toggleLike,
] as const;

const signaturesSlice = createSlice({
  name: "signatures",
  initialState,
  reducers: {
    setC13Input(state, { payload }: PayloadAction<string>) {
      state.filter.c13Max = payload;
    },
    setTitleInput(state, { payload }: PayloadAction<string>) {
      state.filter.title = payload;
    },
    applyFilter(state) {
      const value = Number(state.filter.c13Max);
      const c13Max =
        state.filter.c13Max === "" || Number.isNaN(value)
          ? C13_MAX
          : Math.min(C13_MAX, Math.max(C13_MIN, value));
      state.filter.c13Max = String(c13Max);
      state.appliedFilter = { c13Max, title: state.filter.title.trim() };
    },
    resetFilter(state) {
      state.filter = initialFilter;
      state.appliedFilter = initialAppliedFilter;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSignaturesList.fulfilled, (state, { payload }) => {
        state.list = payload.items;
        state.isMock = payload.isMock;
      })
      .addCase(getSignature.fulfilled, (state, { payload }) => {
        state.current = payload.item;
        state.isMock = payload.isMock;
      })
      .addCase(getDraft.fulfilled, (state, { payload }) => {
        state.draft = payload;
      })
      .addCase(createDraft.fulfilled, (state, { payload }) => {
        state.draft = payload;
      })
      .addCase(publishDraft.fulfilled, (state, { payload }) => {
        state.draft = null;
        state.current = payload;
        state.list = [];
      })
      .addCase(deleteSignature.fulfilled, (state, { payload: id }) => {
        state.list = state.list.filter((item) => item.id !== id);
        if (state.draft?.id === id) state.draft = null;
        if (state.current?.id === id) state.current = null;
      })
      .addCase(toggleLike.fulfilled, (state, { payload }) => {
        for (const item of [state.current, ...state.list]) {
          if (item?.id === payload.id) {
            item.is_liked = payload.like;
            item.likes_count = payload.likes_count;
          }
        }
      })
      .addMatcher(isPending(...thunks), (state) => {
        state.pending += 1;
        state.error = null;
      })
      .addMatcher(isFulfilled(...thunks), (state) => {
        state.pending -= 1;
      })
      .addMatcher(isRejected(...thunks), (state, { payload }) => {
        state.pending -= 1;
        state.error = typeof payload === "string" ? payload : "Ошибка запроса";
      });
  },
});

interface StateWithSignatures {
  signatures: SignaturesState;
}

export const useSignatures = () =>
  useSelector((state: StateWithSignatures) => state.signatures.list);
export const useCurrentSignature = () =>
  useSelector((state: StateWithSignatures) => state.signatures.current);
export const useSignatureDraft = () =>
  useSelector((state: StateWithSignatures) => state.signatures.draft);
export const useSignatureFilter = () =>
  useSelector((state: StateWithSignatures) => state.signatures.filter);
export const useAppliedSignatureFilter = () =>
  useSelector((state: StateWithSignatures) => state.signatures.appliedFilter);
export const useSignaturesLoading = () =>
  useSelector((state: StateWithSignatures) => state.signatures.pending > 0);
export const useSignaturesError = () =>
  useSelector((state: StateWithSignatures) => state.signatures.error);
export const useSignaturesIsMock = () =>
  useSelector((state: StateWithSignatures) => state.signatures.isMock);

export const {
  setC13Input: setC13InputAction,
  setTitleInput: setTitleInputAction,
  applyFilter: applyFilterAction,
  resetFilter: resetFilterAction,
  clearError: clearErrorAction,
} = signaturesSlice.actions;

export default signaturesSlice.reducer;
