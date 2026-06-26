"use client";
import { useAuth } from "@/context/AuthContext";
import { TopNavigation } from "./top-navigation";
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
  const isAuthPage = pathname ? authPages.includes(pathname) : false;

  useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      router.push("/signin");
    }
  }, [user, loading, isAuthPage, router]);

  if (loading) {
     return (
       <div className="flex h-screen items-center justify-center bg-[#0B0B0B] text-white">
         <div className="flex flex-col items-center gap-3">
           <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#7EE787]" />
           <span className="font-mono text-xs tracking-widest uppercase text-[#7A7A7A]">Loading CP.cpp</span>
         </div>
       </div>
     );
  }

  if (!user && !isAuthPage) {
    return null;
  }

  if (isAuthPage) {
    return <main className="bg-[#0B0B0B] min-h-screen text-white">{children}</main>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0B] text-white">
      <TopNavigation />
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-6 pt-4 pb-12">
        {children}
      </main>
    </div>
  );
}
