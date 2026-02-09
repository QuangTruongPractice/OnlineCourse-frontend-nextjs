import NextAuth from "next-auth"
import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import api from "@/src/utils/api";

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // Xử lý khi đăng nhập bằng Google
            if (account?.provider === "google" && account.id_token) {
                console.log(">>> Google sign in detected");

                try {
                    // Gọi backend custom để verify và lấy token
                    const response = await api.post('/auth/google/', {
                        token: account.id_token
                    });

                    if (response.data && response.data.access_token) {
                        token.accessToken = response.data.access_token;
                        token.refreshToken = response.data.refresh_token;
                        token.user = response.data.user;
                        console.log(">>> Google auth successful with backend");
                    }
                } catch (error) {
                    console.error(">>> Google backend auth error:", error);
                    // Không throw error ở đây để tránh crash, nhưng token sẽ không có accessToken
                }
            }

            return token;
        },
        async session({ session, token }) {
            // Truyền thông tin user và token vào session
            if (token.accessToken) {
                (session as any).accessToken = token.accessToken;
                if (token.user) {
                    session.user = {
                        ...session.user,
                        ...(token.user as any)
                    };
                }
            }
            return session;
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }