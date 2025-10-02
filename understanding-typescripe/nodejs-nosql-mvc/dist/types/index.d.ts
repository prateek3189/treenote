import { Request, Response } from "express";
import { Db } from "mongodb";
export type UserType = "A" | "U";
export type MessageType = "success" | "error" | "warning" | "info";
export type DatabaseResult = Db | {
    message: string;
};
export type UploadStatus = "pending" | "success" | "error" | "processing";
export type FileType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";
export interface IUser {
    id: string;
    email: string;
    name: string;
    user_type: UserType;
    isAuthenticated: boolean;
}
export interface ISession {
    user?: IUser;
    additionalInfo?: AdditionalInfo;
    addtionalInfo?: AdditionalInfo;
}
export interface AdditionalInfo {
    message: string;
    type: MessageType;
    error?: string;
    email?: string;
    password?: string;
    username?: string;
    confirm_password?: string;
}
export interface AuthenticatedRequest extends Request {
    session: any;
    file?: Express.Multer.File;
}
export interface AppResponse extends Response {
    locals: {
        isAdmin?: boolean;
    };
}
export interface ICategory {
    name: string;
    _id?: string;
}
export interface IContact {
    name: string;
    phone: string;
    category: string;
    avatar?: string;
    _id?: string;
    categoryName?: string;
}
export interface IContactWithCategory extends IContact {
    categoryName: string;
}
//# sourceMappingURL=index.d.ts.map