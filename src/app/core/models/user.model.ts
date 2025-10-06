// src/app/core/models/user.model.ts

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string; // Make optional if not always present or computed
  profileImage?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  // If your backend provides createdAt/updatedAt, add them here
  // createdAt?: Date;
  // updatedAt?: Date;
}

// You might also want to move AuthData and AuthResponse here if they are frequently used
// export interface AuthData {
//   email: string;
//   password: string;
//   firstName?: string;
//   lastName?: string;
// }

// export interface AuthResponse {
//   token: string;
//   user: User; // Reference the User interface
// }