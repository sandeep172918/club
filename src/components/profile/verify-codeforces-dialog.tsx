"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, ExternalLink, Copy } from "lucide-react";

interface VerifyCodeforcesDialogProps {
  onVerified: (handle: string) => Promise<void>;
}

export default function VerifyCodeforcesDialog({
  onVerified,
}: VerifyCodeforcesDialogProps) {
  const [handle, setHandle] = useState("");
  const [step, setStep] = useState<"input" | "challenge">("input");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const checkHandleExists = async () => {
    if (!handle) return;
    setLoading(true);
    try {
      const res = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
      const data = await res.json();
      if (data.status === "OK") {
        setStep("challenge");
      } else {
        toast({
          title: "Invalid Handle",
          description: `Could not find handle '${handle}'.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to Codeforces API.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifySubmission = async () => {
    setLoading(true);
    try {
      // Fetch last 5 submissions to be safe
      const res = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=5`);
      const data = await res.json();
      
      if (data.status === "OK" && data.result.length > 0) {
        // Find a submission to problem 1/A that is recent (e.g. within last 10 minutes)
        const recentSubmission = data.result.find((sub: any) => {
            const isProblem1A = sub.problem.contestId === 1 && sub.problem.index === "A";
            const submissionTime = sub.creationTimeSeconds * 1000;
            const now = Date.now();
            const isRecent = (now - submissionTime) < 10 * 60 * 1000; // 10 minutes
            return isProblem1A && isRecent;
        });

        if (recentSubmission) {
             await onVerified(handle);
             setIsOpen(false);
             // Reset state
             setStep("input");
             setHandle("");
        } else {
             toast({
                title: "Verification Failed",
                description: "Could not find a recent submission to problem 1/A from this handle. Please try again.",
                variant: "destructive",
            });
        }
      } else {
         toast({
            title: "Verification Failed",
            description: "No submissions found or API error.",
            variant: "destructive",
        });
      }
    } catch (error) {
       toast({
        title: "Error",
        description: "Failed to verify submission.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: "Copied to clipboard" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
            setStep("input"); // Reset on close
        }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
           Connect Codeforces
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Codeforces Handle</DialogTitle>
          <DialogDescription>
            Link your Codeforces account to track your progress.
          </DialogDescription>
        </DialogHeader>

        {step === "input" ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cf-handle">Codeforces Handle</Label>
              <Input
                id="cf-handle"
                placeholder="tourist"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') checkHandleExists();
                }}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
             <div className="rounded-md bg-muted p-4 text-sm">
                <p className="font-medium mb-2">Instructions:</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li>
                        Go to problem <a href="https://codeforces.com/contest/1/problem/A" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                            1/A (Theatre Square) <ExternalLink className="h-3 w-3"/>
                        </a>
                    </li>
                    <li>
                        Submit a solution with <strong>Compilation Error</strong> (select any language).
                    </li>
                    <li>
                        The source code MUST be exactly your handle:
                        <div className="mt-1 flex items-center gap-2">
                            <code className="bg-black text-white px-2 py-1 rounded select-all">
                                {handle}
                            </code>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(handle)}>
                                <Copy className="h-3 w-3"/>
                            </Button>
                        </div>
                    </li>
                    <li>
                        Click <strong>Done</strong> below.
                    </li>
                </ol>
             </div>
          </div>
        )}

        <DialogFooter className="sm:justify-end">
           {step === "input" ? (
               <Button onClick={checkHandleExists} disabled={loading || !handle}>
                   {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   Next
               </Button>
           ) : (
               <div className="flex gap-2 w-full justify-end">
                   <Button variant="ghost" onClick={() => setStep("input")} disabled={loading}>
                       Back
                   </Button>
                   <Button onClick={verifySubmission} disabled={loading}>
                       {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                       Done, I have submitted
                   </Button>
               </div>
           )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
