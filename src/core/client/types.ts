export type TimedResponse<T = unknown> = {
  status: number;
  body: T;
  headers: Record<string, string>;
};
