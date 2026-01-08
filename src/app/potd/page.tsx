"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import ManagePOTDDialog from "@/components/potd/add-potd-dialog";
import POTDCard from "@/components/potd/potd-card";
import POTDLeaderboardDialog from "@/components/potd/potd-leaderboard-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
                                        <TableHead className="w-[100px] text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {archivedPotds.map((potd) => (
                                        <TableRow key={potd._id}>
                                            <TableCell className="font-medium">{potd.problemName}</TableCell>
                                            {isAdmin && <TableCell className="text-center">{potd.editorialRequests || 0}</TableCell>}
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={potd.link} target="_blank">
                                                        Solve <ExternalLink className="ml-1 h-3 w-3" />
                                                    </Link>
                                                </Button>
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
