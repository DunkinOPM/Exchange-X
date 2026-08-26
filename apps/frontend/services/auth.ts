import { api } from "./api";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/auth/login",
    {
      email,
      password,
    },
  );

  return data;
}

export async function register(
  email: string,
  username: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/auth/register",
    {
      email,
      username,
      password,
    },
  );

  return data;
}