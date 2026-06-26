"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Club, Student } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  LogOut, 
  ArrowRight,
  ShieldAlert
} from "lucide-react";

export default function JoinClubPage() {
  const { user, refreshUser, signout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    // Fetch all clubs
    const fetchClubs = async () => {
      try {
        const res = await fetch("/api/clubs");
        const json = await res.json();
        if (json.success) {
          setClubs(json.data);
        }
      } catch (error) {
        console.error("Error fetching clubs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  // Redirect if they are already approved members or super admins
  useEffect(() => {
    if (user && user.role !== "student" && user.clubJoinStatus === "Approved") {
      router.push("/");
    }
  }, [user, router]);

  const handleJoinRequest = async (clubId: string) => {
    if (!user?._id) return;
    setSubmitting(clubId);
    try {
      const res = await fetch(`/api/clubs/${clubId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: user._id }),
      });
      const json = await res.json();
      if (json.success) {
        await refreshUser();
        toast({
          title: "Request Submitted",
          description: "Your join request has been sent to the club coordinator.",
        });
      } else {
        toast({
          title: "Request Failed",
          description: json.error || "Could not submit join request.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(null);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0B0B0B] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#7EE787]" />
          <span className="font-mono text-xs tracking-widest uppercase text-[#7A7A7A]">Loading catalog...</span>
        </div>
      </div>
    );
  }

  const uClubId = typeof user.clubId === 'object' && user.clubId ? (user.clubId as any)._id : user.clubId;
  const requestedClub = clubs.find(c => c._id === uClubId);

  return (
    <div className="min-h-screen bg-[#0B0B0B] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(126,231,135,0.08),rgba(255,255,255,0))] text-white px-6 py-12 flex flex-col items-center justify-center">
      
      {/* Top Header Panel */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="font-bold text-[#7EE787]">CP</span>
          </div>
          <span className="font-bold tracking-tight text-sm text-[#7A7A7A]">CP.cpp Onboarding</span>
        </div>
        <Button variant="ghost" size="sm" onClick={signout} className="text-[#B5B5B5] hover:text-red-400 gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl">
        
        {user.clubJoinStatus === "Pending" && requestedClub ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/5 bg-[#161616]/60 backdrop-blur-xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/20 via-amber-500 to-amber-500/20" />
            <div className="mx-auto h-16 w-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
              <Clock className="h-8 w-8 text-amber-500 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Request Pending Approval</h2>
            <p className="text-[#B5B5B5] text-sm max-w-md mx-auto mb-8">
              Your request to join <span className="text-white font-semibold">{requestedClub.name}</span> has been submitted and is currently being reviewed by the club coordinator.
            </p>
            <div className="rounded-2xl bg-white/5 border border-white/5 p-6 mb-8 inline-flex items-center gap-4 text-left">
              <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                {requestedClub.logo || "🚀"}
              </div>
              <div>
                <h4 className="text-sm font-semibold">{requestedClub.name}</h4>
                <p className="text-xs text-[#7A7A7A] uppercase tracking-wider">{requestedClub.type} Club</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-[#7A7A7A] italic">We will notify you on this dashboard once approved.</p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-12">
            
            {/* Header copy */}
            <div className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-[#7A7A7A] bg-clip-text text-transparent">
                Choose Your Club
              </h1>
              <p className="text-[#B5B5B5] max-w-lg mx-auto text-sm md:text-base">
                Welcome, {user.name}! To get access to the CP.cpp competitive programming dashboards and events, please request to join one primary club.
              </p>

              {user.clubJoinStatus === "Rejected" && (
                <div className="mx-auto max-w-md mt-4 flex items-center gap-3 rounded-xl bg-red-950/30 border border-red-500/20 p-4 text-left">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-red-400">Request Rejected</h5>
                    <p className="text-[11px] text-[#B5B5B5]">Your previous join request was rejected. Please select another club to apply.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map((club) => {
                const isSelected = uClubId === club._id;
                return (
                  <motion.div
                    key={club._id}
                    whileHover={{ y: -4, borderColor: "rgba(255, 255, 255, 0.15)" }}
                    className="relative flex flex-col justify-between rounded-2xl border border-white/5 bg-[#161616]/40 backdrop-blur-sm p-6 overflow-hidden group"
                  >
                    {/* Color bar indicator */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-[3px]"
                      style={{ background: club.bannerColor }}
                    />
                    
                    <div className="space-y-4">
                      {/* Top Row with Logo & Type tag */}
                      <div className="flex justify-between items-start">
                        <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {club.logo || "🚀"}
                        </div>
                        <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border ${
                          club.type === "official" 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        }`}>
                          {club.type}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold tracking-tight group-hover:text-[#7EE787] transition-colors">
                          {club.name}
                        </h3>
                        <p className="text-xs text-[#B5B5B5] leading-relaxed line-clamp-3">
                          {club.description || "No description provided."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 space-y-4">
                      {/* Coordinator list */}
                      {club.coordinators && club.coordinators.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-[#7A7A7A] uppercase tracking-wider font-semibold">Coordinator</span>
                          <span className="text-xs font-medium text-white truncate">
                            {(club.coordinators as any).map((c: any) => c.name).join(", ")}
                          </span>
                        </div>
                      )}

                      {/* Join Button */}
                      <Button
                        onClick={() => handleJoinRequest(club._id!)}
                        disabled={submitting !== null || isSelected}
                        className="w-full justify-between items-center rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors py-5"
                      >
                        <span className="text-xs font-semibold">
                          {submitting === club._id ? "Submitting..." : "Apply to Join"}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
