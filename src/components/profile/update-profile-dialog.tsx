
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
  const [favoriteLanguage, setFavoriteLanguage] = useState(
    user?.favoriteLanguage || ""
  );
  const [shirtSize, setShirtSize] = useState(user?.shirtSize || "");
  const [sport, setSport] = useState(user?.sport || "");
  const [branch, setBranch] = useState(user?.branch || "");
  const [hashKey, setHashKey] = useState(""); // Default empty, only update if user types
  const [isOpen, setIsOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setFavoriteLanguage(user?.favoriteLanguage || "");
      setShirtSize(user?.shirtSize || "");
      setSport(user?.sport || "");
      setBranch(user?.branch || "");
      setHashKey(""); 
    }
  }, [isOpen, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updates: any = {
      favoriteLanguage,
      shirtSize,
      sport,
      branch,
    };

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
