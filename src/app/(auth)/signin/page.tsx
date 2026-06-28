"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Club } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Users, Sparkles, Trophy, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SigninPage() {
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const [clubs, setClubs] = useState<Club[]>([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});
  
  const [selectedCategory, setSelectedCategory] = useState<"official" | "fan">("official");
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Club registration state
  const [showOfficialWarning, setShowOfficialWarning] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regClubName, setRegClubName] = useState("");
  const [regCoordinatorEmail, setRegCoordinatorEmail] = useState("");
  const [regClubType, setRegClubType] = useState<"official" | "fan">("official");
  const [submittingReg, setSubmittingReg] = useState(false);

  const handleRegisterClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regClubName || !regCoordinatorEmail || !regClubType) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }
    setSubmittingReg(true);
    try {
      const res = await fetch("/api/clubs/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regClubName,
          email: regCoordinatorEmail,
          type: regClubType,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast({
          title: "Registration Requested",
          description: "Your club registration request has been sent to the super admin for activation.",
        });
        setRegClubName("");
        setRegCoordinatorEmail("");
        setRegClubType("official");
        setIsRegisterOpen(false);
      } else {
        toast({
          title: "Request Failed",
          description: json.error || "Could not submit registration request.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setSubmittingReg(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (!selectedClub) {
      toast({
        title: "Club Selection Required",
        description: "Please select a club from the dropdown on the left before signing in.",
        variant: "destructive",
      });
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("selected_club_id", selectedClub._id || "");
    }
    
    if (selectedClub.type === 'official') {
      setShowOfficialWarning(true);
    } else {
      signInWithGoogle();
    }
  };

  // Fetch active clubs and calculate mock member counts or fetch real counts
  useEffect(() => {
    const loadLandingData = async () => {
      try {
        // Fetch all active clubs (by default /api/clubs returns active ones)
        const resClubs = await fetch("/api/clubs");
        const jsonClubs = await resClubs.json();
        if (jsonClubs.success) {
          setClubs(jsonClubs.data);
        }

        // Fetch students to compute actual member count per club
        const resStudents = await fetch("/api/students");
        const jsonStudents = await resStudents.json();
        if (jsonStudents.success) {
          const counts: Record<string, number> = {};
          jsonStudents.data.forEach((student: any) => {
            const clubIdStr =
              typeof student.clubId === "object" && student.clubId
                ? student.clubId._id
                : student.clubId;
            if (clubIdStr && student.clubJoinStatus === "Approved") {
              counts[clubIdStr] = (counts[clubIdStr] || 0) + 1;
            }
          });
          setMemberCounts(counts);
        }
      } catch (error) {
        console.error("Error loading landing page data:", error);
      } finally {
        setLoadingClubs(false);
      }
    };

    loadLandingData();
  }, []);

  const filteredClubs = clubs.filter((c) => c.type === selectedCategory);

  return (
    <div className="min-h-screen w-full bg-[#0d0d0d] text-white flex flex-col md:flex-row selection:bg-[#7EE787]/20 relative overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#7EE787]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* LEFT COLUMN: Core Branding & Club Selector */}
      <div className="w-full md:w-[55%] flex flex-col justify-between p-8 sm:p-12 md:p-16 border-b md:border-b-0 md:border-r border-white/5 relative z-10">
        
        {/* Top Header Label */}
        
        

        {/* Center content */}
        <div className="my-auto py-12 md:py-24 space-y-10">
          
          {/* Big Branding of CP.cpp with logo left */}
          <div className="flex items-center gap-4">
            <img 
              src="/logo.svg" 
              alt="CP.cpp Logo" 
              className="h-16 w-16 md:h-20 md:w-20 object-contain" 
            />
            <span className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white">
              CP.cpp
            </span>
          </div>

          {/* Tagline Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none bg-gradient-to-b from-white to-[#A0A0A0] bg-clip-text text-transparent">
              Where Coders Find Their Crew
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-[#7EE787] font-bold">
              code together compete forever
            </p>
          </div>

          {/* Selector Section */}
          <div className="space-y-4 max-w-md">
            <h3 className="text-sm font-semibold tracking-wider text-[#7A7A7A] uppercase">
              Are you part of any clubs?
            </h3>
            
            {/* Category Segmented Toggle */}
            <div className="flex p-1 bg-[#161616] rounded-xl border border-white/5 w-fit">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("official");
                  setSelectedClub(null);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  selectedCategory === "official"
                    ? "bg-[#222] text-white border border-white/5 shadow-sm"
                    : "text-[#7A7A7A] hover:text-white border border-transparent"
                }`}
              >
                Official Clubs
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("fan");
                  setSelectedClub(null);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide tracking-wide transition-all ${
                  selectedCategory === "fan"
                    ? "bg-[#222] text-white border border-white/5 shadow-sm"
                    : "text-[#7A7A7A] hover:text-white border border-transparent"
                }`}
              >
                Fan Clubs
              </button>
            </div>

            {/* Custom Dropdown Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-[#161616]/50 border border-white/5 rounded-xl text-left text-sm text-white hover:border-[#7EE787]/30 transition-all duration-200 outline-none focus:border-[#7EE787]/30"
              >
                <span className="truncate">
                  {selectedClub
                    ? `${selectedClub.logo || "🚀"} ${selectedClub.name}`
                    : "Select a club..."}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-[#7A7A7A] transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-20 w-full mt-2 bg-[#161616] border border-white/5 rounded-xl shadow-2xl max-h-60 overflow-y-auto p-1.5 space-y-1"
                  >
                    {loadingClubs ? (
                      <div className="text-center py-6 text-xs text-[#7A7A7A] italic">
                        Loading clubs...
                      </div>
                    ) : filteredClubs.length === 0 ? (
                      <div className="text-center py-6 text-xs text-[#7A7A7A] italic">
                        No active clubs in this category
                      </div>
                    ) : (
                      filteredClubs.map((club) => (
                        <button
                          key={club._id}
                          type="button"
                          onClick={() => {
                            setSelectedClub(club);
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs transition-all ${
                            selectedClub?._id === club._id
                              ? "bg-[#7EE787]/15 text-[#7EE787] border border-[#7EE787]/20 shadow-sm"
                              : "text-[#B5B5B5] hover:bg-white/5 hover:text-white border border-transparent"
                          }`}
                        >
                          <span className="text-base select-none">
                            {club.logo || "🚀"}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold truncate text-white">
                              {club.name}
                            </p>
                            <p className="text-[10px] text-[#7A7A7A] truncate mt-0.5">
                              {club.description || "No description provided."}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Selector Help Info */}
            <div className="space-y-2 mt-2">
              <p className="text-[11px] text-[#555] leading-relaxed flex items-start gap-1.5">
                <Info className="h-3.5 w-3.5 text-[#555] shrink-0 mt-0.5" />
                <span>
                  If your club isn't registered here, contact your coordinator to fill this.
                </span>
              </p>
              <button
                type="button"
                onClick={() => setIsRegisterOpen(true)}
                className="text-xs text-[#7EE787] hover:text-[#6ed678] font-semibold underline underline-offset-4 transition-all"
              >
                Register Your Club
              </button>
            </div>

          </div>
        </div>

        {/* Footer Copy */}
        <p className="text-[11px] text-[#444] font-mono">
          CP.cpp © {new Date().getFullYear()} — Designed with Rich Data and Love
        </p>

      </div>

      {/* RIGHT COLUMN: Codeforces Skyline, Club Info Card & Primary CTA */}
      <div className="w-full md:w-[45%] flex flex-col justify-between p-8 sm:p-12 md:p-16 bg-[#090909]/60 relative z-10">
        
        {/* Skyline illustration of CF Logo */}
        <div className="flex items-end justify-center gap-5 h-56 w-full mb-8 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_0%,transparent_70%)] pointer-events-none" />
          
          {/* Left Bar: Red (Medium) */}
          <div className="w-12 h-36 bg-gradient-to-t from-[#8E2828] to-[#b13434] rounded-t-2xl border-t border-r border-l border-white/5 shadow-[0_0_30px_rgba(177,52,52,0.25)] relative group">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/20" />
          </div>

          {/* Middle Bar: Blue (Tallest) */}
          <div className="w-12 h-48 bg-gradient-to-t from-[#205D72] to-[#318da9] rounded-t-2xl border-t border-r border-l border-white/5 shadow-[0_0_40px_rgba(49,141,169,0.25)] relative group">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/20" />
          </div>

          {/* Right Bar: Yellow (Shortest) */}
          <div className="w-12 h-24 bg-gradient-to-t from-[#B29227] to-[#f7d046] rounded-t-2xl border-t border-r border-l border-white/5 shadow-[0_0_20px_rgba(247,208,70,0.25)] relative group">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Club Profile Card */}
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full my-8">
          <AnimatePresence mode="wait">
            {selectedClub ? (
              <motion.div
                key={selectedClub._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-[#161616]/30 border border-white/5 rounded-2xl p-6 space-y-4 backdrop-blur-sm relative overflow-hidden"
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-[2px]" 
                  style={{ background: selectedClub.bannerColor || "linear-gradient(135deg, #1f1f1f 0%, #111 100%)" }}
                />

                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-sm">
                    {selectedClub.logo || "🚀"}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-lg tracking-tight">
                      {selectedClub.name}
                    </h4>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#7EE787] mt-0.5 inline-block">
                      {selectedClub.type} Category
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#B5B5B5] leading-relaxed line-clamp-3">
                  {selectedClub.description || "No description provided."}
                </p>

                {/* Statistics / Member Count */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#7A7A7A]">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-[#7EE787]" />
                    <span className="font-semibold text-white">
                      {memberCounts[selectedClub._id!] || 0}
                    </span>
                    <span>members approved</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-[10px] uppercase tracking-wider font-bold">Active Roster</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/[0.01] backdrop-blur-sm"
              >
                <div className="mx-auto h-12 w-12 rounded-full border border-dashed border-white/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-5 w-5 text-[#555] animate-pulse" />
                </div>
                <h4 className="text-sm font-semibold text-white">Your Club Profile</h4>
                <p className="text-xs text-[#7A7A7A] mt-1 max-w-[200px] mx-auto leading-relaxed">
                  Select a club on the left to see its profile details here.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reassurance & Google Sign-in */}
        <div className="space-y-6 w-full max-w-sm mx-auto">
          
          <p className="text-center text-xs text-[#7A7A7A] max-w-xs mx-auto leading-relaxed">
            Not part of any club? You're still part of the CF community —{" "}
            <span className="text-[#7EE787] font-semibold">welcome!</span>
          </p>

          <Button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-neutral-200 transition-all font-semibold py-6 rounded-full text-sm shadow-md hover:scale-[1.01] duration-200"
          >
            {/* Custom Google SVG Icon */}
            <svg
              className="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Button>

        </div>

      </div>

      {/* Club Registration Modal */}
      <AnimatePresence>
        {isRegisterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRegisterOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#161616] border border-white/5 w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6 text-white"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight">Register Your Club</h3>
                <p className="text-xs text-[#7A7A7A] leading-relaxed">
                  Submit your club details. Once activated by the super admin, your email will automatically receive the Coordinator tag.
                </p>
              </div>

              <form onSubmit={handleRegisterClub} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label htmlFor="clubName" className="text-xs font-semibold text-[#B5B5B5]">Club Name</label>
                  <input
                    type="text"
                    id="clubName"
                    required
                    value={regClubName}
                    onChange={(e) => setRegClubName(e.target.value)}
                    placeholder="e.g. Web Development Club"
                    className="w-full px-3.5 py-2.5 bg-[#0d0d0d] border border-white/5 rounded-xl text-xs text-white placeholder-[#444] focus:border-[#7EE787]/30 transition-colors outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="coordEmail" className="text-xs font-semibold text-[#B5B5B5]">Your Email ID (Coordinator Email)</label>
                  <input
                    type="email"
                    id="coordEmail"
                    required
                    value={regCoordinatorEmail}
                    onChange={(e) => setRegCoordinatorEmail(e.target.value)}
                    placeholder="e.g. coordinator@domain.com"
                    className="w-full px-3.5 py-2.5 bg-[#0d0d0d] border border-white/5 rounded-xl text-xs text-white placeholder-[#444] focus:border-[#7EE787]/30 transition-colors outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#B5B5B5] block">Club Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
                      <input
                        type="radio"
                        name="clubType"
                        checked={regClubType === 'official'}
                        onChange={() => setRegClubType('official')}
                        className="accent-[#7EE787]"
                      />
                      Official Club
                    </label>
                    <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
                      <input
                        type="radio"
                        name="clubType"
                        checked={regClubType === 'fan'}
                        onChange={() => setRegClubType('fan')}
                        className="accent-[#7EE787]"
                      />
                      Fan Club
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(false)}
                    className="px-4 py-2 bg-transparent border border-white/5 hover:bg-white/5 rounded-xl text-xs text-[#B5B5B5] hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReg}
                    className="px-4 py-2 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 rounded-xl text-xs font-bold transition-colors"
                  >
                    {submittingReg ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Official Club Warning Modal */}
      <AnimatePresence>
        {showOfficialWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOfficialWarning(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#161616] border border-white/5 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative z-10 space-y-4 text-white text-center"
            >
              <div className="mx-auto h-12 w-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Info className="h-6 w-6 text-amber-400" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white tracking-tight">Membership Request Required</h3>
                <p className="text-xs text-[#7A7A7A] leading-relaxed">
                  You have selected an <strong>Official Club</strong>. You will need to submit a request for membership from your profile page after logging in to gain full access.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOfficialWarning(false)}
                  className="flex-1 py-2.5 bg-transparent border border-white/5 hover:bg-white/5 rounded-xl text-xs text-[#B5B5B5] hover:text-white transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowOfficialWarning(false);
                    signInWithGoogle();
                  }}
                  className="flex-1 py-2.5 bg-white text-black hover:bg-neutral-200 rounded-xl text-xs font-bold transition-colors shadow-md"
                >
                  Proceed to Login
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
