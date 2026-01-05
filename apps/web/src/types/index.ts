export type ExtractArray<T> = T extends (infer R)[] ? R : T;

export interface AxiosMutateProps<T = unknown> {
  method: "post" | "put" | "delete";
  uri: string;
  data?: T;
}

export interface AxiosQueryProps {
  uri: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export interface Stat {
  totalDiagrams: number;
  totalFolders: number;
  totalSharedDiagrams: number;
}
