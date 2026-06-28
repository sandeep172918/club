"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Student, Club } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSocket } from "@/context/SocketContext";
import DecryptedText from "@/components/ui/decrypted-text";
import { AddStudentDialog } from "@/components/students/add-student-dialog";
import { EditStudentDialog } from "@/components/students/edit-student-dialog";
import { DeleteStudentDialog } from "@/components/students/delete-student-dialog";
import { LogVolunteerDialog } from "@/components/students/log-volunteer-dialog";
import { 
  Users, 
  UserPlus, 
  Building, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Award,
  BookOpen
} from "lucide-react";

export default function StudentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const userClubIdStr = typeof user?.clubId === 'object' && user?.clubId ? (user.clubId as any)._id : (user?.clubId || "");

  const [students, setStudents] = useState<Student[]>([]);
  const { toast } = useToast();
  const { socket } = useSocket();

  // Redirect if not super_admin or coordinator
  useEffect(() => {
    if (user && user.role !== "super_admin" && user.role !== "coordinator") {
      router.push("/");
    }
  }, [user, router]);

  // Clubs state
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClubId, setSelectedClubId] = useState<string>("all");
  
  // Members lists
  const [approvedMembers, setApprovedMembers] = useState<Student[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Student[]>([]);
  
  // All students list (for coordinator assignment selector)
  const [allStudents, setAllStudents] = useState<Student[]>([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Dialogs
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [volunteeringStudent, setVolunteeringStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // New club form state
  const [newClubName, setNewClubName] = useState("");
  const [newClubSlug, setNewClubSlug] = useState("");
  const [newClubType, setNewClubType] = useState<"official" | "fan">("official");
  const [newClubDesc, setNewClubDesc] = useState("");
  const [newClubLogo, setNewClubLogo] = useState("🚀");

  // Fetch all clubs
  const fetchClubs = async () => {
    try {
      const res = await fetch("/api/clubs?all=true");
      const json = await res.json();
      if (json.success) {
        setClubs(json.data);
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  // Fetch all students (for super admin coordinator assignment)
  const fetchAllStudents = async () => {
    try {
      const res = await fetch("/api/students?clubJoinStatus=Approved");
      const json = await res.json();
      if (json.success) {
        setAllStudents(json.data);
      }
    } catch (error) {
      console.error("Error fetching all students:", error);
    }
  };

  // Fetch approved & pending members for the selected club
  const fetchMembers = useCallback(async () => {
    if (!user) return;
    
    // Determine target clubId filter
    let targetClubId = selectedClubId;
    if (user.role === "coordinator") {
      targetClubId = userClubIdStr;
    }

    try {
      // Fetch approved members
      const approvedUrl = `/api/students?clubId=${targetClubId}&clubJoinStatus=Approved`;
      const appRes = await fetch(approvedUrl);
      const appJson = await appRes.json();
      if (appJson.success) {
        setApprovedMembers(appJson.data);
      }

      // Fetch pending members
      const pendingUrl = `/api/students?clubId=${targetClubId}&clubJoinStatus=Pending`;
      const pendRes = await fetch(pendingUrl);
      const pendJson = await pendRes.json();
      if (pendJson.success) {
        setPendingRequests(pendJson.data);
      }
    } catch (error) {
      console.error("Error fetching club members:", error);
    } finally {
      setLoading(false);
    }
  }, [user, selectedClubId, userClubIdStr]);

  useEffect(() => {
    if (user) {
      if (user.role === "coordinator" && userClubIdStr) {
        setSelectedClubId(userClubIdStr);
      }
      fetchClubs();
      fetchAllStudents();
    }
  }, [user, userClubIdStr]);

  useEffect(() => {
    if (user) {
      fetchMembers();
    }
  }, [selectedClubId, user, fetchMembers]);

  // Socket updates listener
  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (update: any) => {
      if (["STUDENT_UPDATED", "STUDENT_ADDED", "STUDENT_DELETED", "CLUB_UPDATED"].includes(update.type)) {
        fetchMembers();
        fetchClubs();
        fetchAllStudents();
      }
    };
    socket.on("data_update", handleUpdate);
    return () => {
      socket.off("data_update", handleUpdate);
    };
  }, [socket, fetchMembers]);

  // 30-second polling fallback auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMembers();
      fetchClubs();
      fetchAllStudents();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchMembers]);

  // Handle Join request action (Approve/Reject)
  const handleRequestAction = async (studentId: string, action: "approve" | "reject", studentClubId?: string) => {
    let clubId = studentClubId || selectedClubId;
    if (user?.role === "coordinator") {
      clubId = userClubIdStr;
    }

    setActionLoading(studentId);
    try {
      const res = await fetch(`/api/clubs/${clubId}/membership-requests/${studentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();
      if (json.success) {
        toast({
          title: action === "approve" ? "Member Approved" : "Member Rejected",
          description: `Successfully ${action === "approve" ? "approved" : "rejected"} the membership request.`,
        });
        fetchMembers();
        socket?.emit("data_update", { type: "STUDENT_UPDATED" });
      } else {
        toast({
          title: "Action Failed",
          description: json.error || "Failed to update membership status.",
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
      setActionLoading(null);
    }
  };



  // Create new club (Super Admin)
  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClubName || !newClubSlug) {
      toast({ title: "Validation Error", description: "Name and slug are required.", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch("/api/clubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClubName,
          slug: newClubSlug.toLowerCase().replace(/\s+/g, "-"),
          type: newClubType,
          description: newClubDesc,
          logo: newClubLogo,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast({ title: "Club Created", description: `Successfully created ${newClubName}!` });
        setNewClubName("");
        setNewClubSlug("");
        setNewClubDesc("");
        setNewClubLogo("🚀");
        fetchClubs();
        socket?.emit("data_update", { type: "CLUB_UPDATED" });
      } else {
        toast({ title: "Error", description: json.error || "Failed to create club.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Request failed.", variant: "destructive" });
    }
  };

  // Delete a club
  const handleDeleteClub = async (clubId: string) => {
    if (!confirm("Are you sure you want to delete this club? All members will be reset to students.")) return;
    try {
      const res = await fetch(`/api/clubs/${clubId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast({ title: "Club Deleted", description: "Club has been removed." });
        fetchClubs();
        fetchMembers();
        socket?.emit("data_update", { type: "CLUB_UPDATED" });
      } else {
        toast({ title: "Error", description: json.error || "Failed to delete.", variant: "destructive" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Activate a club
  const handleActivateClub = async (clubId: string) => {
    try {
      const res = await fetch(`/api/clubs/${clubId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true }),
      });
      const json = await res.json();
      if (json.success) {
        toast({ title: "Club Activated", description: "Successfully activated the club." });
        fetchClubs();
        socket?.emit("data_update", { type: "CLUB_UPDATED" });
      } else {
        toast({ title: "Error", description: json.error || "Failed to activate club.", variant: "destructive" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Toggle Coordinator assignment (Super Admin)
  const handleCoordinatorToggle = async (clubId: string, studentId: string, isCurrentlyCo: boolean) => {
    try {
      const res = await fetch(`/api/clubs/${clubId}/coordinators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          action: isCurrentlyCo ? "remove" : "add",
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast({
          title: "Coordinators Updated",
          description: isCurrentlyCo ? "Removed coordinator." : "Assigned coordinator.",
        });
        fetchClubs();
        fetchMembers();
        socket?.emit("data_update", { type: "STUDENT_UPDATED" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return null;

  const currentClubObj = clubs.find(c => c._id === selectedClubId);

  return (
    <main className="p-4 md:p-8 space-y-8">
      {/* Header and Club Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <DecryptedText
            text={user.role === "super_admin" ? "Super Admin Center" : "Coordinator Panel"}
            animateOn="view"
            speed={100}
            className="text-3xl font-extrabold tracking-tight text-white sm:truncate sm:text-4xl"
          />
          <p className="mt-1 text-sm text-[#7A7A7A]">
            {user.role === "super_admin" 
              ? "Global control center to manage clubs, members, and coordinators." 
              : `Manage members and attendance for your club: ${currentClubObj?.name || 'Club'}.`}
          </p>
        </div>

        {/* Club Switcher for Super Admin */}
        {user.role === "super_admin" && (
          <div className="w-[240px]">
            <Select value={selectedClubId} onValueChange={setSelectedClubId}>
              <SelectTrigger className="bg-[#161616] border-white/5 text-white">
                <SelectValue placeholder="Filter by Club" />
              </SelectTrigger>
              <SelectContent className="bg-[#161616] border-white/5 text-white">
                <SelectItem value="all">All Clubs (Global Roster)</SelectItem>
                {clubs.map((c) => (
                  <SelectItem key={c._id} value={c._id!}>
                    {c.logo || "🚀"} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Main Tabs System */}
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="bg-[#161616] border border-white/5 p-1 rounded-xl mb-6">
          <TabsTrigger value="members" className="data-[state=active]:bg-[#222] data-[state=active]:text-white rounded-lg px-4 py-2 text-xs font-semibold gap-2">
            <Users className="h-4 w-4 text-[#7EE787]" />
            Approved Members ({approvedMembers.length})
          </TabsTrigger>
          <TabsTrigger value="requests" className="data-[state=active]:bg-[#222] data-[state=active]:text-white rounded-lg px-4 py-2 text-xs font-semibold gap-2 relative">
            <UserPlus className="h-4 w-4 text-[#7EE787]" />
            Pending Requests
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {pendingRequests.length}
              </span>
            )}
          </TabsTrigger>

          {user.role === "super_admin" && (
            <TabsTrigger value="clubs" className="data-[state=active]:bg-[#222] data-[state=active]:text-white rounded-lg px-4 py-2 text-xs font-semibold gap-2">
              <Building className="h-4 w-4 text-[#7EE787]" />
              Manage Clubs
            </TabsTrigger>
          )}
        </TabsList>

        {/* TAB 1: APPROVED MEMBERS */}
        <TabsContent value="members" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold tracking-tight">Club Members</h3>
            <div className="flex gap-3">
              <Button onClick={() => setIsAddStudentOpen(true)} variant="secondary" className="rounded-xl text-xs">
                <Plus className="h-4 w-4 mr-1" />
                Add Student
              </Button>
            </div>
          </div>

          <Card className="bg-[#161616]/40 border-white/5 backdrop-blur-sm">
            <Table>
              <TableHeader className="border-white/5">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="text-[#7A7A7A]">Name</TableHead>
                  <TableHead className="text-[#7A7A7A]">Email ID</TableHead>
                  <TableHead className="text-[#7A7A7A]">CF Handle</TableHead>
                  {selectedClubId === "all" && <TableHead className="text-[#7A7A7A]">Clubs</TableHead>}
                  <TableHead className="text-[#7A7A7A]">Role</TableHead>
                  <TableHead className="text-[#7A7A7A]">Points</TableHead>
                  <TableHead className="text-right text-[#7A7A7A]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-[#7A7A7A] italic">
                      No approved members in this club.
                    </TableCell>
                  </TableRow>
                ) : (
                  approvedMembers.map((member) => (
                    <TableRow key={member._id} className="hover:bg-white/5 border-white/5">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-white/10">
                            <AvatarImage src={`https://github.com/${member.codeforcesHandle}.png`} />
                            <AvatarFallback className="bg-white/5 text-xs text-white">
                              {member.name[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-[#B5B5B5]">{member.email}</TableCell>
                      <TableCell>
                        {member.codeforcesHandle ? (
                          <a 
                            href={`https://codeforces.com/profile/${member.codeforcesHandle}`}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[#7EE787] font-semibold hover:underline"
                          >
                            {member.codeforcesHandle}
                          </a>
                        ) : (
                          <span className="text-[#7A7A7A] text-xs italic">Unlinked</span>
                        )}
                      </TableCell>
                      {selectedClubId === "all" && (
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                            {member.clubs && member.clubs.filter((c: any) => c.status === 'Approved').map((c: any) => {
                              const clb = c.clubId;
                              if (!clb) return null;
                              return (
                                <span key={clb._id} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/5 text-neutral-300 inline-flex items-center gap-1">
                                  {clb.logo || "🚀"} {clb.name}
                                </span>
                              );
                            })}
                            {member.role === 'coordinator' && member.clubId && (
                              (() => {
                                const clb = member.clubId as any;
                                const clbId = typeof clb === 'object' && clb ? clb._id : clb;
                                const isAlreadyShown = member.clubs && member.clubs.some((c: any) => {
                                  const cClubId = typeof c.clubId === 'object' && c.clubId ? c.clubId._id : c.clubId;
                                  return c.status === 'Approved' && cClubId === clbId;
                                });
                                if (isAlreadyShown) return null;
                                const logo = typeof clb === 'object' && clb ? clb.logo : "🚀";
                                const name = typeof clb === 'object' && clb ? clb.name : "Coordinator";
                                return (
                                  <span key={clbId} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 inline-flex items-center gap-1">
                                    {logo || "🚀"} {name || "Coordinator"}
                                  </span>
                                );
                              })()
                            )}
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                          member.role === "super_admin" 
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : member.role === "coordinator"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}>
                          {member.role === "super_admin" ? "Owner" : member.role}
                        </span>
                      </TableCell>
                      <TableCell className="font-bold text-[#7EE787]">{member.points || 0} PTS</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setVolunteeringStudent(member)} 
                            className="text-[#7EE787] hover:text-[#6ed678] font-semibold"
                          >
                            Log Hours
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setEditingStudent(member)} 
                            className="text-[#B5B5B5] hover:text-white"
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setDeletingStudent(member)} 
                            className="text-red-500 hover:text-red-400"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* TAB 2: PENDING JOIN REQUESTS */}
        <TabsContent value="requests" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold tracking-tight">Pending Membership Requests</h3>
              <p className="text-xs text-[#7A7A7A]">Students who requested to join this club. Approved members gain access to all dashboards.</p>
            </div>
          </div>

          <Card className="bg-[#161616]/40 border-white/5 backdrop-blur-sm">
            <Table>
              <TableHeader className="border-white/5">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="text-[#7A7A7A]">Student Name</TableHead>
                  <TableHead className="text-[#7A7A7A]">Email ID</TableHead>
                  <TableHead className="text-[#7A7A7A]">CF Handle</TableHead>
                  {selectedClubId === "all" && <TableHead className="text-[#7A7A7A]">Requested Club</TableHead>}
                  <TableHead className="text-right text-[#7A7A7A]">Approve / Reject</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-[#7A7A7A] italic">
                      No pending membership requests.
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingRequests.map((student) => (
                    <TableRow key={student._id} className="hover:bg-white/5 border-white/5">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-white/10">
                            <AvatarImage src={`https://github.com/${student.codeforcesHandle}.png`} />
                            <AvatarFallback className="bg-white/5 text-xs text-white">
                              {student.name[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-[#B5B5B5]">{student.email}</TableCell>
                      <TableCell>
                        {student.codeforcesHandle ? (
                          <span className="font-semibold text-neutral-300">{student.codeforcesHandle}</span>
                        ) : (
                          <span className="text-[#7A7A7A] text-xs italic">Unlinked</span>
                        )}
                      </TableCell>
                      {selectedClubId === "all" && (
                        <TableCell>
                          {student.clubId ? (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/5 text-neutral-300 inline-flex items-center gap-1">
                              {typeof student.clubId === 'object' ? (student.clubId as any).logo || "🚀" : "🚀"}{" "}
                              {typeof student.clubId === 'object' ? (student.clubId as any).name : "Club"}
                            </span>
                          ) : (
                            <span className="text-xs text-[#7A7A7A] italic">None</span>
                          )}
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            disabled={actionLoading !== null}
                            onClick={() => handleRequestAction(student._id!, "approve", typeof student.clubId === 'object' && student.clubId ? (student.clubId as any)._id : student.clubId)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg h-8 text-xs gap-1.5"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={actionLoading !== null}
                            onClick={() => handleRequestAction(student._id!, "reject", typeof student.clubId === 'object' && student.clubId ? (student.clubId as any)._id : student.clubId)}
                            className="rounded-lg h-8 text-xs gap-1.5"
                          >
                            <X className="h-3.5 w-3.5" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>



        {/* TAB 3: MANAGE CLUBS (SUPER ADMIN ONLY) */}
        {user.role === "super_admin" && (
          <TabsContent value="clubs" className="space-y-8">
            
            {/* Active Clubs Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold tracking-tight">Active Clubs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clubs.filter(c => c.isActive).map((club) => (
                  <Card key={club._id} className="bg-[#161616]/40 border-white/5 backdrop-blur-sm p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                          {club.logo || "🚀"}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base">{club.name}</h4>
                          <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`}>
                            Active {club.type}
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteClub(club._id!)}
                        className="text-[#7A7A7A] hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-xs text-[#B5B5B5] leading-relaxed">
                      {club.description || "No description provided."}
                    </p>

                    {/* Coordinator List in Card */}
                    <div className="pt-4 border-t border-white/5 space-y-3">
                      <div>
                        <span className="text-[10px] text-[#7A7A7A] uppercase tracking-wider font-semibold">Assign Coordinator</span>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {allStudents.map((student) => {
                            const isCo = club.coordinators.some((c: any) => (typeof c === 'object' ? c._id : c) === student._id);
                            return (
                              <button
                                key={student._id}
                                onClick={() => handleCoordinatorToggle(club._id!, student._id!, isCo)}
                                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                                  isCo
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                    : "bg-transparent text-[#7A7A7A] border-white/5 hover:border-white/20"
                                }`}
                              >
                                {student.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {clubs.filter(c => c.isActive).length === 0 && (
                  <p className="text-sm text-[#7A7A7A] italic col-span-2">No active clubs. Activate a club below.</p>
                )}
              </div>
            </div>

            {/* Pending / Inactive Clubs Section */}
            <div className="space-y-4 pt-6 border-t border-white/5">
              <h3 className="text-lg font-bold tracking-tight">Pending / Inactive Clubs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clubs.filter(c => !c.isActive).map((club) => (
                  <Card key={club._id} className="bg-[#161616]/40 border-white/5 backdrop-blur-sm p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                          {club.logo || "🚀"}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base">{club.name}</h4>
                          <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20`}>
                            Pending {club.type}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleActivateClub(club._id!)}
                        className="bg-[#7EE787] text-black hover:bg-[#6ed678] rounded-xl text-xs font-semibold py-1.5 px-3 h-8 animate-pulse"
                      >
                        Activate Club
                      </Button>
                    </div>

                    <p className="text-xs text-[#B5B5B5] leading-relaxed">
                      {club.description || "No description provided."}
                    </p>
                  </Card>
                ))}
                {clubs.filter(c => !c.isActive).length === 0 && (
                  <p className="text-sm text-[#7A7A7A] italic col-span-2">No pending clubs available.</p>
                )}
              </div>
            </div>

          </TabsContent>
        )}
      </Tabs>

      {/* Edit Student Dialog */}
      {editingStudent && (
        <EditStudentDialog
          isOpen={editingStudent !== null}
          onClose={() => setEditingStudent(null)}
          student={editingStudent}
          onUpdate={(updatedStudent) => {
            fetchMembers();
            setEditingStudent(null);
            socket?.emit("data_update", { type: "STUDENT_UPDATED" });
          }}
        />
      )}

      {/* Delete Student Dialog */}
      {deletingStudent && (
        <DeleteStudentDialog
          isOpen={deletingStudent !== null}
          onClose={() => setDeletingStudent(null)}
          studentName={deletingStudent.name}
          onConfirm={async () => {
            try {
              const res = await fetch(`/api/students/${deletingStudent._id}`, { method: "DELETE" });
              if (res.ok) {
                toast({ title: "Student Deleted", description: "Successfully removed student profile." });
                fetchMembers();
                socket?.emit("data_update", { type: "STUDENT_DELETED" });
              }
            } catch (error) {
              console.error(error);
            } finally {
              setDeletingStudent(null);
            }
          }}
        />
      )}

      {/* Add Student Dialog */}
      <AddStudentDialog
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onStudentAdded={(newStudent) => {
          fetchMembers();
          setIsAddStudentOpen(false);
          socket?.emit("data_update", { type: "STUDENT_ADDED" });
        }}
      />

      {/* Log Volunteer Dialog */}
      {volunteeringStudent && (
        <LogVolunteerDialog
          isOpen={volunteeringStudent !== null}
          onClose={() => setVolunteeringStudent(null)}
          student={volunteeringStudent}
          clubId={selectedClubId === "all" ? (typeof volunteeringStudent.clubId === 'object' && volunteeringStudent.clubId ? (volunteeringStudent.clubId as any)._id : (volunteeringStudent.clubId || "")) : selectedClubId}
        />
      )}
    </main>
  );
}
