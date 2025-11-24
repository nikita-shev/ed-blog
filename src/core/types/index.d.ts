declare global {
    declare namespace Express {
        export interface Request {
            appContext: { userId: string | undefined };
        }
    }
}

export {};
