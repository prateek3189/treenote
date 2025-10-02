import mongodbStore from "connect-mongodb-session";
export declare function createSessionStore(session: any): mongodbStore.MongoDBStore;
export declare function createSessionConfig(sessionStore: any): {
    secret: string;
    resave: boolean;
    saveUninitialized: boolean;
    store: any;
    cookie: {
        maxAge: number;
        sameSite: string;
    };
};
//# sourceMappingURL=session.d.ts.map