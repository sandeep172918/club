
"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Student } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface UpdateProfileDialogProps {
  user: Student | null;
  onUpdateProfile: (
    profile: {
      codeforcesHandle?: string;
      favoriteLanguage?: string;
      shirtSize?: string;
      sport?: string;
      branch?: string;
      hashKey?: string;
    }
  ) => void;
}

export default function UpdateProfileDialog({
  user,
  onUpdateProfile,
}: UpdateProfileDialogProps) {
  const [codeforcesHandle, setCodeforcesHandle] = useState(
    user?.codeforcesHandle || ""
  );
  const [favoriteLanguage, setFavoriteLanguage] = useState(
    user?.favoriteLanguage || ""
  );
  const [shirtSize, setShirtSize] = useState(user?.shirtSize || "");
  const [sport, setSport] = useState(user?.sport || "");
  const [branch, setBranch] = useState(user?.branch || "");
  const [hashKey, setHashKey] = useState(""); // Default empty, only update if user types
  const [isOpen, setIsOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const { toast } = useToast();

  const isCFHandleLocked = !!user?.codeforcesHandle && user?.role !== 'admin';

  useEffect(() => {
    if (isOpen) {
      setCodeforcesHandle(user?.codeforcesHandle || "");
      setFavoriteLanguage(user?.favoriteLanguage || "");
      setShirtSize(user?.shirtSize || "");
      setSport(user?.sport || "");
      setBranch(user?.branch || "");
      setHashKey(""); 
    }
  }, [isOpen, user]);

  const verifyHandle = async () => {
    if (!codeforcesHandle) return;
    setVerifying(true);
    try {
        const res = await fetch(`https://codeforces.com/api/user.info?handles=${codeforcesHandle}`);
        const data = await res.json();
        if (data.status === "OK") {
            toast({
                title: "Handle Verified",
                description: `Codeforces handle '${codeforcesHandle}' exists!`,
                action: <CheckCircle className="text-green-500 h-6 w-6"/>
            });
        } else {
             toast({
                title: "Invalid Handle",
                description: `Could not find handle '${codeforcesHandle}'.`,
                variant: "destructive",
                action: <XCircle className="text-red-500 h-6 w-6"/>
            });
        }
    } catch (error) {
        toast({
            title: "Verification Error",
            description: "Failed to connect to Codeforces API.",
            variant: "destructive"
        });
    } finally {
        setVerifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submitting if handle is not locked/verified properly? 
    // Actually backend handles final verification, but client side helps.
    
    const updates: any = {
      favoriteLanguage,
      shirtSize,
      sport,
      branch,
    };

    if (!isCFHandleLocked) {
        updates.codeforcesHandle = codeforcesHandle;
    }

    if (hashKey) {
        updates.hashKey = hashKey;
    }

    onUpdateProfile(updates);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Update Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update your profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="codeforcesHandle" className="text-right">
              Codeforces Handle
            </Label>
            <div className="col-span-3 flex gap-2">
                <Input
                id="codeforcesHandle"
                value={codeforcesHandle}
                onChange={(e) => setCodeforcesHandle(e.target.value)}
                placeholder="Enter your CF handle"
                disabled={isCFHandleLocked}
                className={isCFHandleLocked ? "bg-muted text-muted-foreground cursor-not-allowed" : ""}
                />
                {!isCFHandleLocked && (
                    <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={verifyHandle}
                        disabled={verifying || !codeforcesHandle}
                    >
                        {verifying ? <Loader2 className="h-4 w-4 animate-spin"/> : "Verify"}
                    </Button>
                )}
            </div>
            {isCFHandleLocked && <p className="col-span-4 text-xs text-muted-foreground text-right">Contact admin to change handle.</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hashKey" className="text-right">
              Hash Key
            </Label>
            <Input
              id="hashKey"
              type="password"
              value={hashKey}
              onChange={(e) => setHashKey(e.target.value)}
              className="col-span-3"
              placeholder="Set a new hash key (optional)"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="favoriteLanguage" className="text-right">
              Favorite Language
            </Label>
            <Input
              id="favoriteLanguage"
              value={favoriteLanguage}
              onChange={(e) => setFavoriteLanguage(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shirtSize" className="text-right">
              Shirt Size
            </Label>
            <Input
              id="shirtSize"
              value={shirtSize}
              onChange={(e) => setShirtSize(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sport" className="text-right">
              Sport
            </Label>
            <Input
              id="sport"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="branch" className="text-right">
              Branch
            </Label>
            <Input
              id="branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="col-span-3"
            />
          </div>
          <Button type="submit">Update</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
