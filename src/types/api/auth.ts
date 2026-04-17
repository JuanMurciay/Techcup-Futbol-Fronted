export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  email: string;
  type?: string;
}

export interface GoogleAuthRequestDTO {
  idToken: string;
}
