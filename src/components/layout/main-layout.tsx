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
    if (!loading) {
      if (!user && !isAuthPage) {
        router.push("/signin");
      } else if (user) {
        const hasClub = !!user.clubId;
        const isApproved = user.role !== "student"; // coordinator, member, super_admin are approved

        if (!isApproved) {
          // If they are not approved, they can only access /profile or /join-club
          if (pathname !== "/profile" && pathname !== "/join-club") {
            if (hasClub) {
              router.push("/profile");
            } else {
              router.push("/join-club");
            }
          }
        } else {
          // If they are approved, they shouldn't be on /join-club
          if (pathname === "/join-club") {
            router.push("/");
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
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-6 pt-4 pb-12">
        {children}
      </main>
    </div>
  );
}
