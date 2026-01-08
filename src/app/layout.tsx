
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import MainLayout from "@/components/layout/main-layout";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "@/components/ui/toaster";
import SupportBubble from "@/components/support-bubble";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CP.cpp",
  description: "A dashboard to manage your coding club's progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <MainLayout>{children}</MainLayout>
            <SupportBubble />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

