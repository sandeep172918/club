
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/types";

interface AddStudentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentAdded: (student: Student) => void;
}

export const AddStudentDialog: React.FC<AddStudentDialogProps> = ({
  isOpen,
  onClose,
  onStudentAdded,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [codeforcesHandle, setCodeforcesHandle] = useState("");
  const [hashKey, setHashKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Basic validation
      if (!name || !email || !hashKey) {
        toast({
            title: "Validation Error",
            description: "Name, Email and HashKey are required.",
            variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          codeforcesHandle: codeforcesHandle || undefined,
          hashKey,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onStudentAdded(result.data);
        toast({
            title: "Student Added",
            description: `${name} has been added successfully.`,
        });
        // Reset form
        setName("");
        setEmail("");
        setCodeforcesHandle("");
        setHashKey("");
        onClose();
      } else {
        toast({
            title: "Error",
            description: result.error || "Failed to add student.",
            variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({
            title: "Error",
            description: err.message || "An unexpected error occurred.",
            variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Manually add a student to the system. Admin privilege.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Full Name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              placeholder="student@example.com"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="codeforcesHandle" className="text-right">
              CF Handle
            </Label>
            <Input
              id="codeforcesHandle"
              value={codeforcesHandle}
              onChange={(e) => setCodeforcesHandle(e.target.value)}
              className="col-span-3"
              placeholder="Codeforces ID (Optional)"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hashKey" className="text-right">
              Hash Key *
            </Label>
            <Input
              id="hashKey"
              type="password"
              value={hashKey}
              onChange={(e) => setHashKey(e.target.value)}
              className="col-span-3"
              placeholder="Secret login key"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
