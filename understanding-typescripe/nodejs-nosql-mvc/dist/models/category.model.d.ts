import { ICategory } from "../types";
export declare class Category {
    name: string;
    id: string;
    constructor(name: string, id?: string);
    static getAll(): Promise<ICategory[]>;
    getCategory(): Promise<ICategory | null>;
    save(): Promise<import("mongodb").InsertOneResult<import("bson").Document>>;
    update(): Promise<import("mongodb").UpdateResult<import("bson").Document> | undefined>;
    delete(): Promise<import("mongodb").DeleteResult>;
}
//# sourceMappingURL=category.model.d.ts.map