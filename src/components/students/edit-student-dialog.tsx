"use client";

import { useState, useEffect } from "react";
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
import { Student } from "@/types";

interface EditStudentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onUpdate: (updatedStudent: Student) => void;
}

export const EditStudentDialog: React.FC<EditStudentDialogProps> = ({
  isOpen,
  onClose,
  student,
  onUpdate,
}) => {
  const [name, setName] = useState(student?.name || "");
  const [codeforcesHandle, setCodeforcesHandle] = useState(
    student?.codeforcesHandle || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (student) {
      setName(student.name);
      setCodeforcesHandle(student.codeforcesHandle || "");
    }
  }, [student]);

  const handleSubmit = async () => {
    if (!student) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/students/${student._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, codeforcesHandle }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onUpdate({ ...student, name, codeforcesHandle });
        onClose();
      } else {
        setError(result.message || "Failed to update student.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Make changes to the student's profile here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="codeforcesHandle" className="text-right">
              Codeforces Handle
            </Label>
            <Input
              id="codeforcesHandle"
              value={codeforcesHandle}
              onChange={(e) => setCodeforcesHandle(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
