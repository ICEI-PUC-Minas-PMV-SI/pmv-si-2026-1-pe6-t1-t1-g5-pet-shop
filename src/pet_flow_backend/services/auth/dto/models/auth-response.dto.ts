export interface AuthResponseDto {
  user_id: string;
  token: string;
  refresh_token: string;
  clinic_id?: string;
}
