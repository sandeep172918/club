"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import ManagePOTDDialog from "@/components/potd/add-potd-dialog";
import POTDCard from "@/components/potd/potd-card";
import POTDLeaderboardDialog from "@/components/potd/potd-leaderboard-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ExternalLink, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSocket } from "@/context/SocketContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function POTDPage() {
  const { user, refreshUser } = useAuth();
  const [potds, setPotds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { socket } = useSocket();

  const isAdmin = user?.role === 'admin' || (user?.email === 'cp.cpp.club@gmail.com'); 

  const fetchPOTDs = async () => {
    try {
      const res = await fetch('/api/potd');
      const data = await res.json();
      if (data.success) {
        setPotds(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch POTDs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPOTDs();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (data: any) => {
        if (['POTD_UPDATED', 'POTD_DELETED'].includes(data.type)) {
            fetchPOTDs();
        }
    };
    socket.on("data_update", handleUpdate);
    return () => {
        socket.off("data_update", handleUpdate);
    };
  }, [socket]);

  const handleAddPOTD = async (potd: any) => {
    try {
        const res = await fetch('/api/potd', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(potd)
        });
        const data = await res.json();
        if (data.success) {
            toast({ title: "Success", description: "POTD added successfully" });
            fetchPOTDs();
        } else {
             toast({ title: "Error", description: data.error, variant: "destructive" });
        }
    } catch (error) {
         toast({ title: "Error", description: "Failed to add POTD", variant: "destructive" });
    }
  };

  const onVerified = () => {
    fetchPOTDs();
    refreshUser();
  };

  const handleDeletePOTD = async (id: string) => {
      if (!confirm("Are you sure you want to delete this archived problem?")) return;
      try {
          const res = await fetch(`/api/potd/${id}`, { method: 'DELETE' });
          const data = await res.json();
          if (data.success) {
              toast({ title: "Deleted", description: "POTD deleted successfully" });
              socket?.emit('data_update', { type: 'POTD_DELETED' });
              fetchPOTDs();
          } else {
              toast({ title: "Error", description: data.error, variant: "destructive" });
          }
      } catch (error) {
          toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
      }
  };

  const now = new Date().getTime();
  const activePotds = potds.filter(p => new Date(p.endTime).getTime() >= now);
  const archivedPotds = potds.filter(p => new Date(p.endTime).getTime() < now);

  return (
    <main className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Problem of the Day</h1>
            <p className="text-muted-foreground">Solve daily challenges to earn points and climb the leaderboard.</p>
        </div>
        <div className="flex gap-2">
            <POTDLeaderboardDialog />
            {isAdmin && <ManagePOTDDialog onSubmit={handleAddPOTD} />}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
        </div>
      ) : (
        <>
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Active Challenges</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activePotds.length > 0 ? (
                        activePotds.map((potd) => (
                            <POTDCard 
                                key={potd._id} 
                                potd={potd} 
                                userSolved={(user as any)?.solvedPOTDs?.includes(potd._id)}
                                onRefresh={onVerified}
                                isAdmin={isAdmin}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-muted-foreground">
                            No active challenges at the moment. Check back later!
                        </div>
                    )}
                </div>
            </section>

            {archivedPotds.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Archive</h2>
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Problem Name</TableHead>
                                        {isAdmin && <TableHead className="text-center">Requests</TableHead>}
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {archivedPotds.map((potd) => (
                                        <TableRow key={potd._id}>
                                            <TableCell className="font-medium">{potd.problemName}</TableCell>
                                            {isAdmin && <TableCell className="text-center">{potd.editorialRequests || 0}</TableCell>}
                                            <TableCell className="text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={potd.link} target="_blank">
                                                            Solve <ExternalLink className="ml-1 h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                    {isAdmin && (
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDeletePOTD(potd._id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </section>
            )}
        </>
      )}
    </main>
  );
}
