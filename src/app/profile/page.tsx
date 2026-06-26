"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UpdateProfileDialog from "@/components/profile/update-profile-dialog";
import VerifyCodeforcesDialog from "@/components/profile/verify-codeforces-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Award } from "lucide-react";
import DecryptedText from "@/components/ui/decrypted-text";
import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";

function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const { socket } = useSocket();

  const [volunteerLogs, setVolunteerLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const handleRoleRequest = async (requestedRole: 'member' | 'coordinator') => {
    if (!user?._id) return;
    setSubmittingRequest(true);
    try {
      const res = await fetch(`/api/students/${user._id}/role-request`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestedRole }),
      });
      const result = await res.json();
      if (result.success) {
        await refreshUser();
        socket?.emit("data_update", { type: "STUDENT_UPDATED" });
        toast({
          title: "Request Submitted",
          description: `Successfully requested the ${requestedRole} tag!`,
        });
      } else {
        toast({
          title: "Request Failed",
          description: result.error || "Failed to submit request.",
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
      setSubmittingRequest(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetch(`/api/volunteers?studentId=${user._id}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setVolunteerLogs(json.data);
          }
          setLoadingLogs(false);
        })
        .catch(err => {
          console.error("Error fetching volunteer logs:", err);
          setLoadingLogs(false);
        });
    }
  }, [user]);

  // Listen for real-time updates to refresh user profile data
  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (update: any) => {
      if (['STUDENT_UPDATED', 'STUDENT_DELETED'].includes(update.type)) {
        refreshUser();
      }
    };
    socket.on("data_update", handleUpdate);
    return () => {
      socket.off("data_update", handleUpdate);
    };
  }, [socket, refreshUser]);

  // 30-second polling fallback auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      refreshUser();
      // Also fetch volunteer logs to keep them updated
      if (user && user._id) {
        fetch(`/api/volunteers?studentId=${user._id}`)
          .then(res => res.json())
          .then(json => {
            if (json.success) {
              setVolunteerLogs(json.data);
            }
          })
          .catch(err => console.error("Error auto-fetching logs:", err));
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [user, refreshUser]);

  const handleUpdateProfile = async (profile: {
    favoriteLanguage?: string;
    shirtSize?: string;
    sport?: string;
    branch?: string;
    graduatingYear?: number;
  }) => {
    if (user) {
      const res = await fetch(`/api/students/${(user as any)._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });
      const result = await res.json();
      
      if (result.success) {
          await refreshUser();
          toast({
            title: "Success",
            description: "Profile updated successfully!",
          });
      } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update profile",
            variant: "destructive"
          });
      }
    }
  };

  const handleVerifyCodeforces = async (handle: string) => {
    if (user) {
        const res = await fetch(`/api/students/${(user as any)._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ codeforcesHandle: handle }),
        });
        const result = await res.json();

        if (result.success) {
            await refreshUser();
            toast({
                title: "Success",
                description: "Codeforces handle verified and linked!",
            });
        } else {
            toast({
                title: "Error",
                description: result.error || "Failed to link handle",
                variant: "destructive"
            });
        }
    }
  };

  return (
    <main className="p-4 md:p-8">
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        
        {/* Profile Card */}
        <Card className="col-span-1 lg:col-span-2 bg-[#161616]/40 border-white/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-white/5">
            <CardTitle className="text-2xl font-bold">
              <DecryptedText
                text="My Profile"
                animateOn="view"
                speed={100}
              />
            </CardTitle>
            <div className="flex gap-2">
                {!user?.codeforcesHandle ? (
                    <VerifyCodeforcesDialog onVerified={handleVerifyCodeforces} />
                ) : (
                    <Button variant="outline" disabled className="gap-2 cursor-default opacity-100 bg-green-950/20 text-green-400 border-green-500/20 hover:bg-green-950/20">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        Codeforces Verified
                    </Button>
                )}
                <UpdateProfileDialog
                    user={user}
                    onUpdateProfile={handleUpdateProfile}
                />
            </div>
          </CardHeader>
          <CardContent className="mt-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Avatar className="h-32 w-32 border-4 border-[#7EE787]/20 shadow-lg">
                <AvatarImage
                  src={`https://github.com/${user?.codeforcesHandle}.png`}
                  alt={`${user?.name}'s avatar`}
                />
                <AvatarFallback className="text-5xl font-bold bg-[#161616] text-[#7EE787] border border-white/5">
                  {user?.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <h2 className="text-3xl font-extrabold text-white">
                  {user?.name}
                </h2>
                <p className="text-sm text-[#7A7A7A]">{user?.email}</p>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/5 text-white">
                    {user?.role === "super_admin" ? "Owner (Super Admin)" : user?.role}
                  </span>
                  {user?.clubId && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#7EE787]/10 border border-[#7EE787]/20 text-[#7EE787]">
                      Club Member
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/5 pt-8 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex items-center">
                <span className="font-semibold w-1/2 text-[#7A7A7A] text-sm">Favorite Language:</span>
                <span className="w-1/2 text-white text-sm font-semibold">{user?.favoriteLanguage || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-1/2 text-[#7A7A7A] text-sm">Shirt Size:</span>
                <span className="w-1/2 text-white text-sm font-semibold">{user?.shirtSize || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-1/2 text-[#7A7A7A] text-sm">Sport:</span>
                <span className="w-1/2 text-white text-sm font-semibold">{user?.sport || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-1/2 text-[#7A7A7A] text-sm">Branch:</span>
                <span className="w-1/2 text-white text-sm font-semibold">{user?.branch || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-1/2 text-[#7A7A7A] text-sm">Graduating Year:</span>
                <span className="w-1/2 text-white text-sm font-semibold">{user?.graduatingYear || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-1/2 text-[#7A7A7A] text-sm">Codeforces Handle:</span>
                <span className="w-1/2 text-white text-sm font-semibold">{user?.codeforcesHandle || "Not Linked"}</span>
              </div>
            </div>

            {/* Tag Upgrade Request Section */}
            {(user?.role === 'student' || user?.role === 'member') && (
              <div className="mt-8 border-t border-white/5 pt-8 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Request Tag Upgrade
                </h3>
                
                {user?.roleRequestStatus === 'Pending' ? (
                  <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-amber-400">Request Pending Approval</span>
                    <p className="text-[11px] text-[#B5B5B5] leading-relaxed">
                      Your request to get the <span className="text-white font-semibold uppercase">{user.requestedRole}</span> tag is currently being reviewed.
                      {user.requestedRole === 'member' 
                        ? ' Club coordinators and super admins can approve member tags.'
                        : ' Only the super admin can approve coordinator tags.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-[#7A7A7A] leading-relaxed">
                      Need a role upgrade? Request the appropriate tag below to get more access on the platform.
                    </p>
                    
                    {user?.roleRequestStatus === 'Rejected' && (
                      <p className="text-xs text-red-400 font-medium">
                        Your previous request was rejected. Feel free to re-apply if needed.
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3">
                      {user.role === 'student' && (
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          disabled={submittingRequest}
                          onClick={() => handleRoleRequest('member')}
                          className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-semibold px-4 py-2"
                        >
                          Request Member Tag
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Volunteer History Card */}
        <Card className="col-span-1 bg-[#161616]/40 border-white/5 backdrop-blur-sm flex flex-col">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Award className="h-5 w-5 text-[#7EE787]" />
              Volunteer History
            </CardTitle>
            <CardDescription className="text-xs text-[#7A7A7A]">
              Your registered community service and volunteer hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-[460px] space-y-4 pt-4">
            {loadingLogs ? (
              <p className="text-xs text-[#7A7A7A] animate-pulse">Loading logs...</p>
            ) : volunteerLogs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-[#7A7A7A] italic">No volunteer hours logged yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-baseline gap-1 bg-[#161616] p-4 rounded-2xl border border-white/5">
                  <span className="text-3xl font-black text-[#7EE787]">
                    {volunteerLogs.reduce((acc, curr) => acc + curr.hours, 0)}
                  </span>
                  <span className="text-xs font-semibold text-[#B5B5B5] uppercase tracking-wider">Total Volunteer Hours</span>
                </div>
                
                <div className="space-y-3">
                  {volunteerLogs.map((log) => (
                    <div key={log._id} className="rounded-xl bg-white/5 border border-white/5 p-3 space-y-1.5 hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold text-white leading-none">{log.role}</span>
                        <span className="text-[10px] font-mono text-[#7EE787] bg-[#7EE787]/10 px-2 py-0.5 rounded-full border border-[#7EE787]/20 shrink-0">
                          {log.hours} hrs
                        </span>
                      </div>
                      <p className="text-[11px] text-[#B5B5B5] leading-relaxed">{log.description}</p>
                      <div className="flex justify-between items-center text-[9px] text-[#7A7A7A] pt-1">
                        <span className="truncate max-w-[120px]">Club: {log.clubId?.name || "Official Club"}</span>
                        <span>{new Date(log.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </main>
  );
}

export default ProfilePage;
