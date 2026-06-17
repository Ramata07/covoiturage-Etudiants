export type ApiResponse<T> = {
  error: boolean;
  error_message: string | null;
  data: T | null;
};

export const successResponse = <T>(data: T): ApiResponse<T> => ({
  error: false,
  error_message: null,
  data,
});

export const errorResponse = <T = null>(
  errorMessage: string,
  data: T | null = null,
): ApiResponse<T> => ({
  error: true,
  error_message: errorMessage,
  data,
});