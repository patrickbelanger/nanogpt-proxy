export interface RegisterResponseDto {
  email: string;
  role: string;
  accessToken?: string;
  refreshToken?: string;
  pendingReview?: boolean;
}
