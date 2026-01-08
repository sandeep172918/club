
"use client";
import { useAuth } from "@/context/AuthContext";
import Navbar from "./navbar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const authPages = ["/signin", "/signup"];
  const isAuthPage = authPages.includes(pathname);

  useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      router.push("/signin");
    }
  }, [user, loading, isAuthPage, router]);

  if (loading) {
     return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user && !isAuthPage) {
    return null;
  }

  return (
    <>
      {user && <Navbar />}
      {children}
    </>
  );
}
