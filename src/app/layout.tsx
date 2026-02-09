import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Toaster } from "../components/ui/toaster";
import ClientProvider from "../components/clientProvider";
import QueryProvider from "../components/provider/query-provider";
import { ProgressProviders } from "../components/provider/progress.provider";
import SessionProviderWrapper from "../components/session-provider-wrapper";
import GoogleAuthHandler from "../components/auth/google-auth-handler";
import AuthInitializer from "../components/auth/auth-initializer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OnlineCourse - Học tập không giới hạn",
  description: "Nền tảng học trực tuyến premium với giảng viên hàng đầu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="vi">
      <body
        className={`${outfit.variable} ${inter.variable} font-sans antialiased`}
      >
        <SessionProviderWrapper>
          <QueryProvider>
            <ClientProvider>
              <ProgressProviders>
                <GoogleAuthHandler />
                <AuthInitializer />
                <Header />
                <main className="mt-10 mb-10 px-6 md:px-12 lg:px-20 min-h-[60vh]">
                  {children}
                </main>
                <Footer />
                <Toaster />
              </ProgressProviders>
            </ClientProvider>
          </QueryProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

