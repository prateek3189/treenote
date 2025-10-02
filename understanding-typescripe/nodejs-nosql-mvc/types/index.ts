import { Request, Response } from "express";
import { Db } from "mongodb";

// User Type Union
export type UserType = "A" | "U"; // A = Admin, U = User

// Message Type Union
export type MessageType = "success" | "error" | "warning" | "info";

// Database Result Union
export type DatabaseResult = Db | { message: string };

// File Upload Status Union
export type UploadStatus = "pending" | "success" | "error" | "processing";

// File Type Union
export type FileType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

// User Interface
export interface IUser {
  id: string;
  email: string;
  name: string;
  user_type: UserType;
  isAuthenticated: boolean;
}

// Session Interface
export interface ISession {
  user?: IUser;
  additionalInfo?: AdditionalInfo;
  addtionalInfo?: AdditionalInfo; // Note: keeping typo for backward compatibility
}

// Additional Info Interface
export interface AdditionalInfo {
  message: string;
  type: MessageType;
  // For login/register forms
  error?: string;
  email?: string;
  password?: string;
  username?: string;
  confirm_password?: string;
}

// Authenticated Request Interface
export interface AuthenticatedRequest extends Request {
  session: any; // Using any for now to maintain compatibility with express-session
  file?: Express.Multer.File;
}

// Express Response with Locals
export interface AppResponse extends Response {
  locals: {
    isAdmin?: boolean;
  };
}

// Category Interface
export interface ICategory {
  name: string;
  _id?: string;
}

// Contact Interface
export interface IContact {
  name: string;
  phone: string;
  category: string;
  avatar?: string;
  _id?: string;
  categoryName?: string;
}

// Contact with Category Name (for display)
export interface IContactWithCategory extends IContact {
  categoryName: string;
}
