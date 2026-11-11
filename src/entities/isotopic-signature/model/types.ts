import type { ServiceDraftResponse, ServiceResponse } from "../../../shared/api";

export type IsotopicSignature = ServiceResponse;
export type SignatureDraft = ServiceDraftResponse;

export interface SignatureFilterInput {
  c13Max: string;
  title: string;
}

export interface AppliedSignatureFilter {
  c13Max: number | null;
  title: string;
}

export interface NewSignatureData {
  title: string;
  image: File;
  video: File;
}

export interface PublishSignatureData {
  description: string;
  delta_n15: number;
  delta_c13: number;
}
