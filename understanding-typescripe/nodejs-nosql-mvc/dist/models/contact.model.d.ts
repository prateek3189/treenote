import { IContact, IContactWithCategory } from "../types";
export declare class Contact {
    name: string;
    phone: string;
    category: string;
    avatar: string;
    id: string;
    constructor(name: string, phone: string, category: string, avatar: string, id?: string);
    static getAll(): Promise<IContactWithCategory[]>;
    getContact(): Promise<IContact | null>;
    save(): Promise<import("mongodb").InsertOneResult<import("bson").Document> | undefined>;
    update(): Promise<import("mongodb").UpdateResult<import("bson").Document> | undefined>;
    delete(): Promise<import("mongodb").DeleteResult>;
}
//# sourceMappingURL=contact.model.d.ts.map