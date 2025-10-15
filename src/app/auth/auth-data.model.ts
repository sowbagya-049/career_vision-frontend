export interface AuthData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
// Interface for the response from the authentication API
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