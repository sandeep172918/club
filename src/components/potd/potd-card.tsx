"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, ExternalLink, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface POTDProps {
  potd: any;
  userSolved: boolean;
  onVerify: () => void;
}

export default function POTDCard({ potd, userSolved, onVerify }: POTDProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(potd.endTime).getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(timer);
        setIsExpired(true);
        setTimeLeft("Expired");
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [potd.endTime]);

  const handleVerify = async () => {
    setVerifying(true);
    try {
        const res = await fetch('/api/potd/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                potdId: potd._id,
                userId: (user as any)._id,
                codeforcesHandle: user?.codeforcesHandle
            })
        });
        const data = await res.json();
        
        if (data.success) {
            toast({
                title: "Congratulations!",
                description: `You earned ${potd.points} points!`,
                action: <Trophy className="text-yellow-500 h-6 w-6"/>
            });
            onVerify();
            setVerifyOpen(false);
        } else {
            toast({
                title: "Verification Failed",
                description: data.error,
                variant: "destructive"
            });
        }
    } catch (error) {
        toast({ title: "Error", description: "Failed to verify", variant: "destructive" });
    } finally {
        setVerifying(false);
    }
  };

  return (
    <Card className={`flex flex-col h-full ${userSolved ? 'border-green-500 bg-green-50/10' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold truncate pr-2">{potd.problemName}</CardTitle>
            <Badge variant="secondary" className="whitespace-nowrap flex gap-1">
                <Trophy className="h-3 w-3 text-yellow-500"/>
                {potd.points} Pts
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className={isExpired ? "text-red-500 font-medium" : "font-mono"}>
                {timeLeft || "Loading..."}
            </span>
        </div>
        <div className="text-sm">
            <span className="text-muted-foreground">Solved by: </span>
            <span className="font-medium">{potd.solvedBy?.length || 0} students</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button variant="outline" className="w-full" asChild>
            <Link href={potd.link} target="_blank">
                View Problem <ExternalLink className="ml-2 h-4 w-4"/>
            </Link>
        </Button>
        
        {userSolved ? (
             <Button className="w-full bg-green-600 hover:bg-green-700 cursor-default" disabled>
                <CheckCircle className="mr-2 h-4 w-4"/> Solved
             </Button>
        ) : (
            <Dialog open={verifyOpen} onOpenChange={setVerifyOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full" disabled={isExpired || !user?.codeforcesHandle}>
                        {isExpired ? "Expired" : "Submit & Verify"}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Verify Submission</DialogTitle>
                        <DialogDescription>
                            Have you submitted and got <strong>Accepted</strong> on Codeforces for <strong>{potd.problemName}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 text-sm text-muted-foreground">
                        We will check your last submission on Codeforces. Ensure your handle <strong>{user?.codeforcesHandle}</strong> is correct.
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setVerifyOpen(false)}>Cancel</Button>
                        <Button onClick={handleVerify} disabled={verifying}>
                            {verifying ? "Verifying..." : "Yes, Verified Submission"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}
      </CardFooter>
    </Card>
  );
}
