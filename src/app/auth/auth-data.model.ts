export interface AuthData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  success: any;
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}