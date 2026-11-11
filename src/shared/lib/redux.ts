import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

export type AppThunkDispatch = ThunkDispatch<any, unknown, UnknownAction>;

export const useAppDispatch = useDispatch.withTypes<AppThunkDispatch>();
