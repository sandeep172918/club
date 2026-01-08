"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import AddPOTDDialog from "@/components/potd/add-potd-dialog";
import POTDCard from "@/components/potd/potd-card";
import POTDLeaderboardDialog from "@/components/potd/potd-leaderboard-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <main className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Problem of the Day</h1>
            <p className="text-muted-foreground">Solve daily challenges to earn points and climb the leaderboard.</p>
        </div>
        <div className="flex gap-2">
            <POTDLeaderboardDialog />
            {isAdmin && <AddPOTDDialog onAddPOTD={handleAddPOTD} />}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {potds.length > 0 ? (
                potds.map((potd) => (
                    <POTDCard 
                        key={potd._id} 
                        potd={potd} 
                        userSolved={(user as any)?.solvedPOTDs?.includes(potd._id)}
                        onVerify={onVerified}
                    />
                ))
            ) : (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                    No active challenges at the moment. Check back later!
                </div>
            )}
        </div>
      )}
    </main>
  );
}
