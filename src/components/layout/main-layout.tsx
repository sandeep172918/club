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
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user && user._id) {
      fetch(`/api/students/${user._id}/update-participation`, { method: "POST" })
        .then(res => res.json())
        .then(json => {
          if (json.success && !json.cached) {
            console.log("Background Codeforces auto-sync completed.");
            refreshUser();
          }
        })
        .catch(err => console.error("Error auto-syncing:", err));
    }
  }, [user?._id]);

  const authPages = ["/signin", "/signup"];
  const isAuthPage = pathname ? authPages.includes(pathname) : false;

  useEffect(() => {
    if (!loading) {
      if (!user && !isAuthPage) {
        router.push("/signin");
      } else if (user) {
        const isApproved = user.role !== "student"; // coordinator, member, super_admin are approved

        if (!isApproved) {
          // If they are not approved, they can only access /profile, /potd, or /upcoming-contests
          const isAllowedPath = 
            pathname === "/profile" || 
            pathname?.startsWith("/potd") || 
            pathname?.startsWith("/upcoming-contests");

          if (!isAllowedPath) {
            router.push("/profile");
          }
        }
      }
    }
  }, [user, loading, isAuthPage, pathname, router]);

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

  if (isAuthPage || pathname === "/join-club") {
    return <main className="bg-[#0B0B0B] min-h-screen text-white">{children}</main>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0B] text-white">
      <TopNavigation />
      {user && !user.codeforcesHandle && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2.5 px-6 text-center">
          <p className="text-xs font-semibold text-amber-400 flex items-center justify-center gap-2 flex-wrap">
            <span>⚠️ You have not linked your Codeforces ID yet. Go to your</span>
            <a href="/profile" className="underline hover:text-amber-300 transition-colors font-bold">
              Profile Page
            </a>
            <span>to verify and connect it to sync your stats!</span>
          </p>
        </div>
      )}
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-6 pt-4 pb-12">
        {children}
      </main>
    </div>
  );
}
