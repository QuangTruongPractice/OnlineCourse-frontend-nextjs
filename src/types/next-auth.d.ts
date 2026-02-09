import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface JWT {
        accessToken?: string;
        refreshToken?: string;
        user?: {
            id: string;
            email: string;
            name: string;
            avatar?: string;
            role?: string[];
        };
        // Legacy fields for backward compatibility
        "access_token"?: string,
        "_id"?: string,
        "name"?: string,
        "email"?: string,
        "role"?: string[],
        "avatar"?: string,
        "countFollowers"?: number,
        "typeLogin"?: string,
        "followers"?: string[],
        "following"?: string[],
        "shared"?: string[],
        "socketId"?: string
    }

    interface Session extends DefaultSession {
        accessToken?: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar?: string;
            role?: string[];
        } & DefaultSession["user"];
    }
}