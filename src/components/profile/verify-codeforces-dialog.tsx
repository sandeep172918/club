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
  const [verificationString, setVerificationString] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const generateRandomString = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "CPCPP_";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result.toUpperCase();
  };
  const { toast } = useToast();

  const checkHandleExists = async () => {
    if (!handle) return;
    setLoading(true);
    try {
      const res = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
      const data = await res.json();
      if (data.status === "OK") {
        setVerificationString(generateRandomString());
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
      const res = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
      const data = await res.json();
      
      if (data.status === "OK" && data.result.length > 0) {
        const cfUser = data.result[0];
        const cfFirstName = cfUser.firstName || "";
        
        if (cfFirstName.trim().toUpperCase() === verificationString.toUpperCase()) {
             await onVerified(handle);
             setIsOpen(false);
             // Reset state
             setStep("input");
             setHandle("");
             setVerificationString("");
        } else {
             toast({
                title: "Verification Failed",
                description: `Could not find the verification code in your profile's First Name. Found: '${cfFirstName || "None"}'. Expected: '${verificationString}'.`,
                variant: "destructive",
            });
        }
      } else {
         toast({
            title: "Verification Failed",
            description: "Could not fetch user info from Codeforces. Please try again.",
            variant: "destructive",
        });
      }
    } catch (error) {
       toast({
        title: "Error",
        description: "Failed to verify Codeforces handle.",
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
                <ol className="list-decimal list-inside space-y-2.5">
                    <li>
                        Go to your Codeforces <a href="https://codeforces.com/settings/social" target="_blank" rel="noopener noreferrer" className="text-[#7EE787] hover:underline inline-flex items-center gap-1 font-semibold">
                            Profile Settings <ExternalLink className="h-3 w-3"/>
                        </a>
                    </li>
                    <li>
                        Change your <strong>First Name</strong> to:
                        <div className="mt-1 flex items-center gap-2">
                            <code className="bg-black text-white px-2 py-1 rounded select-all font-mono text-xs border border-white/10">
                                {verificationString}
                            </code>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(verificationString)}>
                                <Copy className="h-3 w-3"/>
                            </Button>
                        </div>
                    </li>
                    <li className="text-xs text-[#7A7A7A]">
                        Make sure to click <strong>Save Changes</strong> at the bottom of the settings page.
                    </li>
                    <li>
                        Click <strong>Verify</strong> below.
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
                        Verify
                    </Button>
               </div>
           )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
